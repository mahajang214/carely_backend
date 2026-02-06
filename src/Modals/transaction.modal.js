const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

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

    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CaregiverModal",
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    platformCommission: {
        type: Number,
        default: 0
    },

    caregiverEarning: {
        type: Number,
        default: 0
    },

    commissionPercentage: {
        type: Number,
        default: 5
    },

    paymentMethod: {
        type: String,
        enum: ["upi", "cash", "card"],
        default: "cash"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },

    paidAt: Date,

    // ⭐ Invoice Support
    invoiceNumber: {
        type: String,
        unique: true
    },

    invoiceGeneratedAt: Date

}, { timestamps: true });

/* =====================================================
   ⭐ AUTO COMMISSION + EARNING CALCULATION
===================================================== */

transactionSchema.pre("save", function (next) {

    // Prevent recalculating on update
    if (this.isNew || this.isModified("totalAmount")) {

        const commission = (this.totalAmount * this.commissionPercentage) / 100;

        this.platformCommission = commission;
        this.caregiverEarning = this.totalAmount - commission;
    }

    next();
});

/* =====================================================
   ⭐ AUTO INVOICE NUMBER GENERATION
===================================================== */

transactionSchema.pre("save", function (next) {

    if (!this.invoiceNumber) {

        const timestamp = Date.now();
        const random = Math.floor(1000 + Math.random() * 9000);

        this.invoiceNumber = `INV-${timestamp}-${random}`;
        this.invoiceGeneratedAt = new Date();
    }

    next();
});

const TransactionModal = mongoose.model("TransactionModal", transactionSchema);

module.exports = TransactionModal;
