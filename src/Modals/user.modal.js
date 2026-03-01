const mongoose = require("mongoose");

const userModalSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    linkedPatients: [
        {
            patientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PatientModal"
            },
            relationship: String,
            patientName: String
        }
    ]
    ,

    lastName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    role: {
        type: String,
        enum: ["family", "user"],
        default: "family"
    },

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


    googleId: {
        type: String,
        required: true,
        unique: true,
        select: false,
        index: true
    },

    dateOfBirth: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0
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
    },
    blocked: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }


}, { timestamps: true });
userModalSchema.index({ "address.city": 1 })

const UserModal = mongoose.model("UserModal", userModalSchema);
module.exports = UserModal;
