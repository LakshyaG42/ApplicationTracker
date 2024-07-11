const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    dateApplied: { type: Date, required: true },
    currentStatus: { type: String, required: true },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Application', ApplicationSchema);
