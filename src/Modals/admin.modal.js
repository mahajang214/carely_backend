const mongoose = require("mongoose");

const adminModalSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        select: false
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

adminModalSchema.index({ email: 1 });


const AdminModal = mongoose.model("AdminModal", adminModalSchema);
module.exports = AdminModal;