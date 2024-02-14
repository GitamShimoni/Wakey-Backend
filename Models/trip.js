const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  destination: {
    stopId: String,
    stopName: String,
    lat: String,
    long: String,
  },
  timeOfRequest: { type: Date, required: false },
  wakeUpTimer: { type: Number, required: false },
  wakeUpKillometer: { type: Number, required: false },
  finished: { type: Boolean, required: false },
  //   posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Trip", tripSchema);
