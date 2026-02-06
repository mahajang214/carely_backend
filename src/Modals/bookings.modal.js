const mongoose = require("mongoose");

const bookingModalSchema = new mongoose.Schema({

    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CaregiverModal',
        required: true
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServicesModal',
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientModal',
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModal',
        required: true
    },

    requestStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },

    serviceStatus: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },

    bookingType: {
        type: String,
        enum: ["hourly", "daily", "long-term"],
        required: true
    },

    schedule: {
        startDate: Date,
        endDate: Date,
        timeSlot: String
    },

    servicePrice: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["upi", "card", "cash"],
        default: "upi"
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    TransactionModal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransactionModal"
    },

    cancellationReason: String,

    careNotes: [{
        from: String,
        to: String,
        note: String,
        date: Date,
        isRead: { type: Boolean, default: false }
    }]

}, { timestamps: true });


const BookingModal = mongoose.model("BookingModal", bookingModalSchema);
module.exports = BookingModal;