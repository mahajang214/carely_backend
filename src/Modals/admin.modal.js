const mongoose = require("mongoose");

const adminModalSchema = new mongoose.Schema({
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
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
   

}, {timestamps: true});

const AdminModal = mongoose.model("AdminModal", adminModalSchema);
module.exports = AdminModal;