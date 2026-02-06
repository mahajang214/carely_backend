const mongoose = require("mongoose");

const patientModalSchema = new mongoose.Schema({

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

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    emergencyContact: {
        name: { type: String, required: true },
        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/
        }
    },

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },

    allergies: {
        type: [String],
        default: []
    },

    chronicConditions: {
        type: [String],
        default: []
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true   // patient email optional
    },

    medicalNeeds: {
        type: [String],
        default: []
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



const PatientModal = mongoose.model("PatientModal", patientModalSchema);
module.exports = PatientModal;
