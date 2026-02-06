const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    googleId: {
        type: String,
        required: true,
        unique: true,
        select: false
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    qualifications: {
        type: [String],
        default: []
    },

    ratingAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    mobileNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
        select: false
    },

    verificationDocuments: [String],

    verified: {
        type: Boolean,
        default: false
    },

    verifiedAt: Date,

    readyForService: {
        type: Boolean,
        default: false
    },

    profilePicture: {
        type: String,
        default: null
    }

}, { timestamps: true });


const CaregiverModal = mongoose.model("CaregiverModal", caregiverSchema);
module.exports = CaregiverModal;