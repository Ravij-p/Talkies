const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  msg: {
    type: String,
  },
  timestamp: {
    type: Number,
  },
});
const msg = new mongoose.model("MSG", msgSchema);
module.exports = msg;
