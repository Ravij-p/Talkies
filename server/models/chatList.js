const mongoose = require("mongoose");
const chatListSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const chatList = new mongoose.model("chatList", chatListSchema);
module.exports = chatList;
