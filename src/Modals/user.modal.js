const mongoose = require("mongoose");

const userModalSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true 
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        index: true 
    },

    role: {
        type: String,
        enum: ["family", "user"],
        default: "family"
    },

    address: {
        fullAddress: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    googleId: {
        type: String,
        required: true,
        unique: true,
        select: false,
        index: true 
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true 
    },

    mobileNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
        select: false
    },

    profilePicture: {
        type: String,
        default: null
    },

    lastActiveAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

const UserModal = mongoose.model("UserModal", userModalSchema);
module.exports = UserModal;
