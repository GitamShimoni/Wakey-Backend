const Trip = require("../Models/trip");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");
// destination: {
//   stopId: String,
//   stopName: String,
//   lat: String,
//   long: String,
// },
// timeOfRequest: { type: Date, required: false },
// wakeUpTimer: { type: Number, required: false },
// wakeUpKillometer: { type: Number, required: false },
// finished: { type: Boolean, required: false },

const newTrip = async (req, res) => {
  const { stopId, stopName, lat, long, wakeUpTimer, wakeUpKillometer, shilut } =
    req.body;
  console.log(
    stopId,
    stopName,
    lat,
    long,
    wakeUpTimer,
    wakeUpKillometer,
    shilut
  );
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const destinationObj = {
      stopId: stopId,
      stopName: stopName,
      lat: lat,
      long: long,
    };
    console.log(destinationObj, wakeUpKillometer, wakeUpTimer);
    console.log(req.body);
    const newTrip = await Trip.create({
      destination: destinationObj,
      timeOfRequest: new Date(),
      wakeUpTimer: wakeUpTimer,
      wakeUpKillometer: wakeUpKillometer,
      finished: false,
      shilut: shilut,
    });
    const usesAmount = await User.findById(realId.id);
    const updateUser = await User.findByIdAndUpdate(realId.id, {
      appUses: usesAmount.appUses + 1,
      $push: { trips: { _id: newTrip._id } },
    });
    // console.log(updateUser);
    console.log(newTrip, "This is the new trip");
    return res.status(200).json(newTrip);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const finishLastTrip = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const updateUser = await User.findById(realId.id);
    const tempUserTrip = updateUser.trips[updateUser.trips.length - 1];
    console.log(tempUserTrip._id, "This is the user trip");
    const updatedTrip = await Trip.findByIdAndUpdate(
      tempUserTrip._id,
      {
        finished: true,
      },
      { new: true }
    );
    console.log(updatedTrip); // console.log(updateUser);
    return res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const getLastTrip = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const updateUser = await User.findById(realId.id);
    const tempUserTrip = updateUser.trips[updateUser.trips.length - 1];
    console.log(tempUserTrip);
    const updatedTrip = await Trip.findById(tempUserTrip._id);
    console.log(updatedTrip); // console.log(updateUser);
    return res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getTripById = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const tripId = req.headers.tripid;
    const updatedTrip = await Trip.findById(tripId);
    return res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  newTrip,
  finishLastTrip,
  getTripById,
  getLastTrip,
};
