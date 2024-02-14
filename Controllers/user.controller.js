const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");

const getUser = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const UserData = await User.findOne({ _id: realId.id });
    // console.log(UserData, "This is the user DATA");
    return res.status(200).json(UserData);
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
const editUserBio = async (req, res) => {
  try {
    const { bio, hobbies, education } = req.body;
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    console.log(bio, hobbies, education, realId);
    const newUser = await User.findByIdAndUpdate(realId.id, {
      bio: [bio, hobbies, education],
    });
    console.log(newUser, "This is the new bio");
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const editUserIMG = async (req, res) => {
  try {
    const { profilePic } = req.body;
    console.log(profilePic, "This is the profile pic");
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const newUser = await User.findByIdAndUpdate(realId.id, {
      profilePic: profilePic,
    });
    console.log(newUser, "This is the new profile picture link");
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getUserBio = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const newUser = await User.findById(realId.id);
    return res.status(200).json(newUser.bio);
  } catch (err) {
    return res.status(500).json(err.message);
  }
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
  getUsers,
  editUserBio,
  editUserIMG,
  getUserBio,
  addAFriend,
};
