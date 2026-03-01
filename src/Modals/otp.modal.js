// models/OtpRequest.model.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModal",
    required: true
  }
  ,
  otpHash: { type: String, required: true },
  patientName: String,
  relationship: String,
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const OtpRequest = mongoose.model("OtpRequest", otpSchema);
module.exports = OtpRequest;
