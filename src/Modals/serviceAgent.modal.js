const mongoose = require("mongoose");

const serviceAgentSchema = new mongoose.Schema({
    agentName: {
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
});

const ServiceAgentModal = mongoose.model("ServiceAgentModal", serviceAgentSchema);
module.exports = ServiceAgentModal;