const mongoose = require("mongoose");

const bookingModalSchema = new mongoose.Schema({

    // 🔹 Relations
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CaregiverModal'
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServicesModal',
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientModal'
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModal',
        required: true
    },

    // 🔹 Booking Lifecycle
    bookingStatus: {
        type: String,
        enum: [
            'pending',
            'accepted',
            'rejected',
            'scheduled',
            'in-progress',
            'completed',
            'cancelled'
        ],
        default: 'pending',
        index: true
    },

    // 🔹 Schedule
    schedule: {
        startDate: { type: Date, required: true },
        endDate: Date,
        timeSlot: String
    },
    // 🔹 Duration (Better Structure)
    duration: {
        hours: {
            type: Number,
            required: true
        },
        pricePerDay: {
            type: Number,
            required: true
        }
    },

    totalDays: {
        type: Number,
        required: true
    },

    pricing: {
        basePrice: Number,
        platformFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        finalPerDay: Number
    },

    grandTotal: Number,

    // 🔹 Payment
    paymentMethod: {
        type: String,
        enum: ["upi", "card", "cash"],
        default: "upi"
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransactionModal"
    },

    // 🔹 Cancellation
    cancellation: {
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "cancellation.cancelledByModel"
        },
        cancelledByModel: {
            type: String,
            enum: ["UserModal", "CaregiverModal", "AdminModal"]
        },
        reason: String,
        cancelledAt: Date,
        refundStatus: {
            type: String,
            enum: ["none", "initiated", "completed"]
        }
    },

    // 🔹 Notes
    careNotes: {
        type: [
            {
                note: {
                    type: String,
                    required: true
                },
                addedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: "careNotes.roleModel"
                },
                roleModel: {
                    type: String,
                    enum: ["UserModal", "CaregiverModal", "AdminModal"]
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                senderRole: {
                    type: String,
                    enum: ["user", "member", "caregiver", "admin"],
                    required: true
                }
            }
        ],
        default: [] // 🔥 THIS PREVENTS PUSH ERROR
    },

    bookingServiceCategory: {
        type: String,
        required: true
    },


}, { timestamps: true });

bookingModalSchema.index({ userId: 1, createdAt: -1 });
bookingModalSchema.index({ caregiverId: 1, bookingStatus: 1 });


const BookingModal = mongoose.model("BookingModal", bookingModalSchema);
module.exports = BookingModal;