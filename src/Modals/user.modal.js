const mongoose = require("mongoose");

const userModalSchema = new mongoose.Schema({
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
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    medicalNeeds: {
        type: [String],
        required: true
    },
    allTimesServies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ServicesModal',
        default: []
    },
    serviceStatus: {
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'BookingModal',
        default: []
    }

}, {
    timestamps: true
});

const UserModal = mongoose.model("UserModal", userModalSchema);
module.exports = UserModal;