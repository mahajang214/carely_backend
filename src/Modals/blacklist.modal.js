const mongoose = require('mongoose');

const blackListModalSchema = new mongoose.Schema({
    blacklistedEmailId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
}, { timestamps: true });

blackListModalSchema.pre('save', async function (next) {
    try {
        const existingEntry = await mongoose.model('BlackListModal').findOne({ blacklistedEmailId: this.blacklistedEmailId });
        if (existingEntry) {
            throw new Error('This email ID is already blacklisted.');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const BlackListModal = mongoose.model("BlackListModal", blackListModalSchema);
module.exports = BlackListModal;