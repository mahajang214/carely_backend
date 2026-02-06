const mongoose = require("mongoose");

const adminModalSchema = new mongoose.Schema({});

const AdminModal = mongoose.model("AdminModal", adminModalSchema);
module.exports = AdminModal;