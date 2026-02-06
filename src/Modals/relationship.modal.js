const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientModal",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModal",
    required: true
  },

  relationshipType: {
    type: String,
    enum: ["son", "daughter", "spouse", "guardian", "relative"],
    required: true
  },

  permissions: {
    canBookService: { type: Boolean, default: true },
    canViewMedicalData: { type: Boolean, default: true },
    canEditPatient: { type: Boolean, default: false }
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  approvedAt: Date,

  approvedByAdmin: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

relationshipSchema.index({ patientId: 1, userId: 1 }, { unique: true });

const RelationshipModal = mongoose.model("RelationshipModal", relationshipSchema);
module.exports = RelationshipModal;
