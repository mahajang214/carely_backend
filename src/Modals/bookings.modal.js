const mongoose = require("mongoose");

const bookingModalSchema = new mongoose.Schema({
    caregiverName: String,
    caregiverId: String,
    serviceName: String,
    serviceId: String,
    userId: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'] },
    startDate: Date,
    endDate: Date
}, { timestamps: true });

const BookingModal = mongoose.model("BookingModal", bookingModalSchema);
module.exports = BookingModal;