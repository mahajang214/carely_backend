const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CaregiverModal",
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientModal"
    },

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingModal",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModal",
        required: true
    },
    category:{
        type:String
    },

    review: String,

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }

}, { timestamps: true });

const ReviewModal = mongoose.model("ReviewModal", reviewSchema);
module.exports = ReviewModal;
