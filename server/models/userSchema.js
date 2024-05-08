const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  token: {
    type: String,
  },
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CONTACT",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CONTACT",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "POST",
    },
  ],
  private: {
    type: Boolean,
  },
  followRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
  ],
});
const Users = new mongoose.model("USER", userSchema);
module.exports = Users;
