// models/StatusChangeLog.js
const mongoose = require('mongoose');

const StatusChangeLogSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StatusChangeLog', StatusChangeLogSchema);