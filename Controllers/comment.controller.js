const Post = require("../Models/post");
const User = require("../Models/user");
const Comment = require("../Models/comment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");

const getCommentById = async (req, res) => {
  try {
    const { commentid } = req.body;
    const CommentFound = await Comment.findById(commentid);
    return res.status(202).json(CommentFound);
  } catch (err) {
    res.status(501).send(err);
  }
};

const newComment = async (req, res) => {
  const { writer, description, postid } = req.body;
  const date = new Date();
  const likes = 0;
  try {
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const newComment = await Comment.create({
      writer,
      postid,
      date,
      description,
      likes,
    });
    //SHOULD ADD A POST ID TO THE SCHEMA, FIND IT AND ADD THE COMMENT ID TO IT, TO THE USER TOO.
    const updatePost = await Post.findByIdAndUpdate(postid, {
      $push: { comments: { _id: newComment._id } },
    });
    // console.log(updateUser);
    return res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.body.id;
  const postId = req.body.postId;
  console.log(
    postId,
    "This is the post ID",
    commentId,
    "This is the comment id"
  );
  try {
    // Delete the post
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
    if (!deletedComment) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post reference from the user
    const updatePost = await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    // console.log(deletedComment, "This Comment has been deleted");
    // console.log(updatePost, "THIS IS THE UPDATED Post");

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeComment = async (req, res) => {
  const { commentId, likingUser } = req.body;
  try {
    const currentComment = await Comment.findById(commentId);
    let likes = currentComment.likes;
    if (likes.some((str) => str == likingUser)) {
      likes = likes.filter((str) => {
        return str !== likingUser;
      });
      const newCurrentComment = await Comment.findByIdAndUpdate(commentId, {
        likes: likes,
      });
      res.status(200).json(newCurrentComment);
    } else {
      likes.push(likingUser);
      const newCurrentComment = await Comment.findByIdAndUpdate(commentId, {
        likes: likes,
      });
      res.status(201).json(newCurrentComment);
    }
  } catch {
    res.status(501).send(err);
  }
};

const isCommentLiked = async (req, res) => {
  const { commentId, likingUser } = req.body;
  // console.log(
  //   commentId,
  //   "This is the commentID",
  //   likingUser,
  //   " This is the liking user"
  // );
  try {
    const currentComment = await Comment.findById(commentId);
    let likes = currentComment.likes;
    res.status(200).json(likes.some((str) => str == likingUser));
  } catch {
    res.status(501).send(err);
  }
};

module.exports = {
  getCommentById,
  newComment,
  deleteComment,
  likeComment,
  isCommentLiked,
};
