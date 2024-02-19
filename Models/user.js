const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSleeping: { type: Boolean, required: false },
  voiceType: { type: Number, required: false },
  appUses: { type: Number, required: false },
  phoneNumber: { type: String, required: false },
  trips: [{ type: mongoose.Types.ObjectId, ref: "Trip" }],
  email: { type: String, required: false, unique: false },
  fullName: { type: String, required: false },
  birthDate: { type: Date, required: false },
  gender: { type: String, required: false },
  profilePic: { type: String, required: false },
  // friends: [{ type: mongoose.Types.ObjectId, ref: "Trip" }],
});

module.exports = mongoose.model("User", userSchema);
