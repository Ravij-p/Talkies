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
});
const Contacts = new mongoose.model("CONTACT", contactSchema);
module.exports = Contacts;
