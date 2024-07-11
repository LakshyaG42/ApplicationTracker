const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    user: { type: String, required: true, default: "0"},
    onlineassessments: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    offersreceived: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    currentInterviews: { type: Number, default: 0 },
    currentOAs: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stats', StatsSchema);
