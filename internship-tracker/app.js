const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
const Application = require(path.join(__dirname, 'models', 'Application'));
const Stats = require('./models/Stats');
const StatusChangeLog = require('./models/StatusChangeLog');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/internshipTracker', { useNewUrlParser: true, useUnifiedTopology: true });

const initializeStats = async () => {
    const stats = await Stats.findOne();
    if (!stats) {
        await Stats.create({
            onlineassessments: 0,
            interviews: 0,
            applications: 0,
            offersreceived: 0,
        });
    }
};

initializeStats();

const updateStats = async (oldStatus, newStatus) => {
    const stats = await Stats.findOne();
    if (!stats) {
        console.error('Stats document not found');
        return;
    }
    if (newStatus === null) stats.applications--;
    if (newStatus === 'Online Assessment') stats.onlineassessments++;
    if (newStatus === 'Interview Scheduled') stats.interviews++;
    if (newStatus === 'Applied') stats.applications++;
    if (newStatus === 'Offer Received') stats.offersreceived++;

    await stats.save();
};

app.post('/applications', async (req, res) => {
    const { role, company, dateApplied, currentStatus } = req.body;
    const application = new Application({ role, company, dateApplied, currentStatus });
    await application.save();
    res.status(201).send(application);
    await updateStats(null, currentStatus); 
});

app.get('/applications', async (req, res) => {
    const applications = await Application.find();
    res.send(applications);
});

app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/applications/:id', async (req, res) => {
    const { id } = req.params;
    const { currentStatus } = req.body;

    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        const previousStatus = application.currentStatus;
        application.currentStatus = currentStatus;
        await application.save();

        // Log the status change
        const statusChangeLog = new StatusChangeLog({
            applicationId: id,
            previousStatus,
            newStatus: currentStatus
        });
        await statusChangeLog.save();

        // Update stats
        const stats = await Stats.findOne();        

        // Handle increment based on current status
        if (currentStatus === 'Online Assessment' && previousStatus !== 'Online Assessment') {
            stats.onlineassessments += 1;
        } else if (currentStatus === 'Interview Scheduled') {
            stats.interviews += 1;
        } else if (currentStatus === 'Offer Received') {
            stats.offersreceived += 1;
        }

        await stats.save();

        res.status(200).json(application);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/existing-data', async (req, res) => {
    try {
        const existingRoles = await Application.distinct('role');
        const existingCompanies = await Application.distinct('company');
        res.status(200).json({ roles: existingRoles, companies: existingCompanies });
    } catch (error) {
        console.error('Error fetching existing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedApplication = await Application.findByIdAndDelete(id);
        if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update stats on application deletion
        await updateStats(deletedApplication.currentStatus, null);

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/stats', async (req, res) => {
    try {
        const stats = await Stats.findOne();


        const currentOAs = await Application.countDocuments({ currentStatus: 'Online Assessment' });
        const currentInterviews = await Application.countDocuments({ currentStatus: 'Interview Scheduled' });
        const applications = await Application.countDocuments();
        
        const rejected = await Application.countDocuments({ currentStatus: 'Rejected' });

        res.status(200).json({
            onlineassessments:  stats ? stats.onlineassessments : 0,
            interviews:stats ? stats.interviews : 0,
            applications: applications,
            offersreceived: stats ? stats.offersreceived : 0,
            rejected: rejected,
            currentOAs: currentOAs,
            currentInterviews: currentInterviews
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})