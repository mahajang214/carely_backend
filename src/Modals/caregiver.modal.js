const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    qualifications: {
        type: [String],
        required: true
    },
    ratings: {
        type: Number,
        enum: [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        default: 0,
        max: 5,
        min: 0
    },
    reviews: {
        type: [{ userId: mongoose.Schema.Types.ObjectId, review: String, rating: { type: Number, enum: [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], max: 5, min: 0 }, likes: { type: Number, default: 0 }, dislikes: { type: Number, default: 0 } }],
        default: []
    },
    patientsRequested: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UserModal',
        default: []
    },
    allTimesPatientsServed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'BookingModal',
        default: []
    },
    mobileNumber: {
        type: String,
        required: true,
        select: false
    }

}, { timestamps: true });

const CaregiverModal = mongoose.model("CaregiverModal", caregiverSchema);
module.exports = CaregiverModal;