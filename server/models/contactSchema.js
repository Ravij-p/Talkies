const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  followedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  isMsg: {
    type: Boolean,
    default: false,
  },
});
const Contacts = new mongoose.model("CONTACT", contactSchema);
module.exports = Contacts;
