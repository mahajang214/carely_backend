const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "recipientModel"
    },

    recipientModel: {
        type: String,
        required: true,
        enum: ["UserModal", "PatientModal", "CaregiverModal", "AdminModal"]
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderModel"
    },
    priority: {
        type: String,
        enum: ["low", "normal", "high", "critical"],
        default: "normal"
    },
    deliveryChannels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
    },

    senderModel: {
        type: String,
        enum: ["UserModal", "PatientModal", "CaregiverModal", "AdminModal"],

    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            "booking",
            "complaint",
            "payment",
            "service",
            "system",
            "emergency",
            "relationship_request",
            "relationship_response",
            "general",
            "event_notification",
            "password_reset"
        ],
        default: "system"
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "referenceModel"
    },

    referenceModel: {
        type: String,
        enum: ["BookingModal", "ComplaintModal", "ServicesModal", "ReviewModal"]
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "BookingModal"
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const NotificationModal = mongoose.model("NotificationModal", notificationSchema);

module.exports = NotificationModal
