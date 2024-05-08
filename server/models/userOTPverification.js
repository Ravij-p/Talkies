const mongoose = require("mongoose");
const userOTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});
const userOTPverification = mongoose.model(
  "UserOTPverification",
  userOTPSchema
);
module.exports = userOTPSchema;
module.exports = userOTPverification;
