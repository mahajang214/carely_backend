const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'fromModel'
    },

    fromModel: {
        type: String,
        required: true,
        enum: ['UserModal', 'PatientModal', 'CaregiverModal']
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'toModel'
    },

    toModel: {
        type: String,
        required: true,
        enum: ['UserModal', 'PatientModal', 'CaregiverModal']
    },

    complaint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'rejected'],
        default: 'pending'
    }

}, { timestamps: true });

const ComplaintModal = mongoose.model("ComplaintModal", complaintSchema);
module.exports = ComplaintModal;
