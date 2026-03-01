const mongoose = require("mongoose");

const patientModalSchema = new mongoose.Schema({

    address: {
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },

    role: {
        type: String,
        enum: ["patient"],
        default: "patient"
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
        default: 'male'
    },

    emergencyContact: {
        name: { type: String, required: true },
        phoneNo: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/,
        },
        responsibleUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModal",
            required: true
        },
        relationship: {
            type: String,
            required: true
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
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
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
    age: {
        type: Number,
        min: 0
    },

    profilePicture: {
        type: String,
        default: null
    },

    lastActiveAt: {
        type: Date,
        default: null
    },
    blocked: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });



const PatientModal = mongoose.model("PatientModal", patientModalSchema);
module.exports = PatientModal;
