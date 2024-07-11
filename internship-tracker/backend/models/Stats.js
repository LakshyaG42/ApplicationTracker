const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    onlineassessments: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    offersreceived: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    currentInterviews: { type: Number, default: 0 },
    currentOAs: { type: Number, default: 0 },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Stats', StatsSchema);
