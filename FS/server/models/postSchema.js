const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
  ],
  comment: [
    {
      commentUser: {
        type: String,
      },
      msg: {
        type: String,
      },
    },
  ],
  save: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
  ],
  isVideo: {
    type: Boolean,
  },
});
const Post = new mongoose.model("POST", postSchema);
module.exports = Post;
