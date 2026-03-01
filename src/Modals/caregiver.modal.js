const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
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
                // required: true
            }
        }
    }
    ,

    googleId: {
        type: String,
        required: true,
        unique: true,
        select: false
    },
    role: {
        type: String,
        enum: ["caregiver"],
        default: "caregiver"
    },
    availabilityAndLocation: {
        type: [String],
        default: []
    },
    skills: [{
        name: String,
        experienceYears: Number,
        certified: Boolean
    }],

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

    verificationDocuments: {
        type: [{ name: String, url: String }],
        default: [],
        select: false
    },

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
    },
    blocked: {
        type: Boolean,
        default: false
    },
    servicesOffered: [
        { type: mongoose.Schema.Types.ObjectId, ref: "ServiceModal" }
    ],
    // totalEarning: {
    //     type: Number,
    //     default: 0
    // }
}, { timestamps: true });


caregiverSchema.index({ "address.coordinates": "2dsphere" });
caregiverSchema.index({ "address.city": 1 });
const CaregiverModal = mongoose.model("CaregiverModal", caregiverSchema);
module.exports = CaregiverModal;