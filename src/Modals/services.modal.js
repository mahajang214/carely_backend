const mongoose = require("mongoose");

const servicesModalSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        enum: ['hourly', 'daily', 'long-term'],
        type: String,
        default: 'hourly',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    requiredQualifications: {
        type: [String],
        required: true,
        default: []
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminModal',
        required: true
    },
    
}, { timestamps: true });

const ServicesModal = mongoose.model("ServicesModal", servicesModalSchema);
module.exports = ServicesModal;