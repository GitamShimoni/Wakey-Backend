const Post = require("../Models/post");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");

const newPost = async (req, res) => {
  const { description, image, date, writer } = req.body;
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const newPost = await Post.create({
      description,
      date,
      writer,
      image,
    });
    // console.log(newPost, "This is a new post");
    const updateUser = await User.findByIdAndUpdate(realId.id, {
      $push: { posts: { _id: newPost._id } },
    });
    // console.log(updateUser);
    return res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deletePost = async (req, res) => {
  const postId = req.body.id;
  try {
    // Delete the post
    const deletedPost = await Post.findOneAndDelete({ _id: postId });
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post reference from the user
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const updateUser = await User.findByIdAndUpdate(realId.id, {
      $pull: { posts: postId },
    });

    // console.log(deletedPost, "This post has been deleted");
    // console.log(updateUser, "THIS IS THE UPDATED USER");

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getPostsByToken = async (req, res) => {
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const user = await User.findOne({ _id: realId.id }).populate("posts");
    // console.log(user, "This is the user");
    const postsArr = user.posts;
    // console.log(postsArr, "This is the postsArr");
    if (!user) {
      return res.status(401).json({ message: "not logged in" });
    } else {
      return res.status(202).json(postsArr);
    }
  } catch (err) {
    res.status(501).send(err);
  }
};
const getUserByPost = async (req, res) => {
  try {
    const writer = req.body.writer;
    const user = await User.findOne({ _id: writer });
    // console.log(user, "This is the user");
    const writerUser = {
      userid: user._id,
      fullname: user.fullname,
      profilePic: user.profilePic,
    };
    if (!user) {
      return res.status(401).json({ message: "Cannot find user" });
    } else {
      return res.status(202).json(writerUser);
    }
  } catch (err) {
    res.status(501).send(err);
  }
};
const likePost = async (req, res) => {
  const { postId, likingUser } = req.body;
  try {
    const currentPost = await Post.findById(postId);
    let likes = currentPost.likes;
    if (likes.some((str) => str == likingUser)) {
      likes = likes.filter((str) => {
        return str !== likingUser;
      });
      const newCurrentPost = await Post.findByIdAndUpdate(postId, {
        likes: likes,
      });
      res.status(200).json(newCurrentPost);
    } else {
      likes.push(likingUser);
      const newCurrentPost = await Post.findByIdAndUpdate(postId, {
        likes: likes,
      });
      res.status(201).json(newCurrentPost);
    }
  } catch {
    res.status(501).send(err);
  }
};

const isPostLiked = async (req, res) => {
  const { postId, likingUser } = req.body;
  // console.log(
  //   postId,
  //   "This is the postId",
  //   likingUser,
  //   " This is the liking user"
  // );
  try {
    const currentPost = await Post.findById(postId);
    let likes = currentPost.likes;
    res.status(200).json(likes.some((str) => str == likingUser));
  } catch {
    res.status(501).send(err);
  }
};

module.exports = {
  newPost,
  deletePost,
  getPostsByToken,
  getUserByPost,
  likePost,
  isPostLiked,
};