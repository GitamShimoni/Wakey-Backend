const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");

const getUser = async (req, res) => {
  try {
    console.log(req.headers.token);
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const UserData = await User.findById(realId.id);
    return res.status(200).json(UserData);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const changeIsUserSleepingToTrue = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const UserData = await User.findByIdAndUpdate(
      realId.id,
      {
        isSleeping: true,
      },
      { new: true }
    );

    return res.status(200).json(UserData);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const changeIsUserSleepingToFalse = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const UserData = await User.findByIdAndUpdate(
      realId.id,
      {
        isSleeping: false,
      },
      { new: true }
    );

    return res.status(200).json(UserData);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const changeCallingVoice = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const newVoiceType = req.headers.voicetype;
    console.log("🚀 ~ changeCallingVoice ~ newVoiceType:", newVoiceType)
    const UserData = await User.findByIdAndUpdate(
      realId.id,
      {
        voiceType: newVoiceType,
      },
      { new: true }
    );

    return res.status(200).json(UserData);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const isUserSleeping = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const UserData = await User.findById(realId.id);
    console.log(UserData.isSleeping);
    return res.status(200).json(UserData.isSleeping);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const getUserByUsername = async (req, res) => {
  const { username } = req.body;
  console.log("got into function");
  console.log(username, "This is the username");
  try {
    const query = User.findOne({ username: username })
      .populate("posts")
      .populate({
        path: "posts",
        populate: {
          path: "comments",
        },
      });

    const UserData = await query.exec();

    const newUser = {
      userid: UserData._id,
      fullname: UserData.fullname,
      birthdate: UserData.birthdate,
      profilePic: UserData.profilePic,
      bio: UserData.bio,
      posts: UserData.posts,
    };
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getUsers = (req, res) => {
  User.find({}).then((data) => {
    res.send(data);
  });
};

const addAFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    console.log(friendId, "This is the friendId");
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    console.log(realId, "This is the realid");
    const newUser = await User.findByIdAndUpdate(realId.id, {
      $push: { friends: { id: friendId, status: "pending" } },
    });
    console.log(newUser, "This is the new user with friend");
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = {
  getUser,
  getUserByUsername,
  changeIsUserSleepingToTrue,
  changeIsUserSleepingToFalse,
  isUserSleeping,
  getUsers,
  addAFriend,
  changeCallingVoice
};
