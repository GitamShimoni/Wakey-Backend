const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false, unique: false },
  fullname: { type: String, required: false },
  birthdate: { type: Date, required: false },
  gender: { type: String, required: false },
  profilePic: { type: String, required: false },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", userSchema);
