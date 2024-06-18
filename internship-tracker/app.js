const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const Application = require('./models/Application');

const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware

mongoose.connect('mongodb://localhost:27017/internshipTracker', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/applications', async (req, res) => {
    const { role, company, dateApplied, currentStatus } = req.body;
    const application = new Application({ role, company, dateApplied, currentStatus });
    await application.save();
    res.status(201).send(application);
});

app.get('/applications', async (req, res) => {
    const applications = await Application.find();
    res.send(applications);
});

// GET all applications
app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
