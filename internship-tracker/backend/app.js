const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const Application = require(path.join(__dirname, 'models', 'Application'));
const Stats = require('./models/Stats');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

const port = process.env.PORT || 8100;  // Use the PORT environment variable or default to 8100
const ip = process.env.IP || '::';      // Use the IP environment variable or default to '::'

const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

password = encodeURIComponent(`${process.env.MONOGO_DB_PASSWORD}`)
const connectionUri = `mongodb+srv://lakshyagour42:${password}@application-tracker.szxpwak.mongodb.net/internshipTracker` //`mongodb+srv://lakshyagour42:<${password}@application-tracker.szxpwak.mongodb.net/?retryWrites=true&w=majority&appName=Application-Tracker`;
//mongoose.connect('mongodb://localhost:27017/internshipTracker', { useNewUrlParser: true, useUnifiedTopology: true });
try {
    mongoose.connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}


const initializeStats = async (userId) => {
    try {
        // Check if stats already exist for the user
        const existingStats = await Stats.findOne({ user: userId }).exec();

        if (!existingStats) {
            // Create new stats document only if it doesn't exist
            await Stats.create({
                user: userId,
                onlineassessments: 0,
                interviews: 0,
                applications: 0,
                offersreceived: 0,
                rejected: 0,
                currentInterviews: 0,
                currentOAs: 0
            });
            console.log(`Stats initialized for user ${userId}`);
        }
    } catch (error) {
        console.error('Error initializing stats:', error);
    }
};




//LOGIN THINGS:

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://lakshyag42.alwaysdata.net/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
        
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google', async (req, res) => {
    try {
      const response = await axios.get('https://accounts.google.com/o/oauth2/v2/auth', {
        params: {
          response_type: 'code',
          redirect_uri: 'https://lakshyag42.alwaysdata.net/auth/google/callback',
          client_id: '854392932175-a79ndhc4uc09bnipvf0a0088q8kgubjb.apps.googleusercontent.com'
        }
      });
      res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching OAuth data');
    }
  });
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect to client app
    if(req.user && req.user._id) {
        initializeStats(req.user.googleId);
        console.log(`User ${req.user.googleId} logged in`)
        res.json({ message: 'Login successful',  });
    } else {
        res.status(500).json({ message: 'Login successful but userId not found' });
    }
    
    res.redirect('http://localhost:3001/');
});
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        // Successful logout
        req.session = null; // Clear session if using express-session

        // Optionally, clear any other data or tokens stored in the session

        res.status(200).json({ message: 'Logged out successfully' });
    });
});


app.post('/auth/google', async (req, res) => {
    const { tokenId } = req.body;
    console.log('Received tokenId:', tokenId);
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub: googleId, name, email } = ticket.getPayload();

        let user = await User.findOne({ googleId });

        if (!user) {
            user = new User({
                googleId,
                displayName: name,
                email,
            });
            await user.save();
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed' });
            }
            console.log(`User ${user.googleId} logged in`)
            return res.status(200).json({ message: 'Login successful', userId: user.googleId});
        });
    } catch (error) {
        console.error('Error logging in with Google:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// LOGIN THINGS END

const updateStats = async (userId, newStatus) => {
    
    const stats = await Stats.findOne({ user: userId });
    if (!stats) {
        initializeStats(userId);
        stats = await Stats.findOne({ user: userId });
    }
    if (newStatus === null) stats.applications--;
    if (newStatus === 'Online Assessment') stats.onlineassessments++;
    if (newStatus === 'Interview Scheduled') stats.interviews++;
    if (newStatus === 'Applied') stats.applications++;
    if (newStatus === 'Offer Received') stats.offersreceived++;

    await stats.save();
};

app.post('/applications', async (req, res) => {
    console.log('Creating new application:', req.body);
    const { role, company, dateApplied, currentStatus } = req.body;
    const userId = req.query.userId;
    try {
        const application = new Application({ role, company, dateApplied, currentStatus, user: userId });
        await application.save();
        res.status(201).send(application);
        await updateStats(userId, currentStatus); // Update stats on application creation
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/applications', async (req, res) => {
    const userId = req.query.userId;
    console.log('Fetching /applications for user:', userId);
    try {
        const applications = await Application.find({ user: userId });
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.put('/applications/:id', async (req, res) => {
    const { id } = req.params;
    const { currentStatus } = req.body;
    const userId = req.query.userId;

    console.log('Updating status for application:', id, 'to', currentStatus);
    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const previousStatus = application.currentStatus;
        application.currentStatus = currentStatus;
        await application.save();

        // Fetch or create stats for the user
        console.log('DETECTED APPLICATION CHANGE: Updating stats for user:', userId)
        let stats = await Stats.findOne({ user: userId });
        if (!stats) {
            console.log('Stats not found, initializing...');
            initializeStats(userId);
            stats = await Stats.findOne({ user: userId });
            if(!stats) {
                console.log('Stats not found, initializing failed');
                return res.status(500).json({ error: 'Stats not found' });
            }
        }
        console.log('Stats:', stats);
        // Update stats based on status change
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
    console.log('Deleting /application/:', id);
    try {
        const deletedApplication = await Application.findByIdAndDelete(id);
        if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update stats on application deletion
        //await updateStats(deletedApplication.currentStatus, null);

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/stats', async (req, res) => {
    try {
        console.log('Fetching /stats for user:', req.query.userId);
        const userId = req.query.userId;
        // Fetch stats for the logged-in user only
        const stats = await Stats.findOne({ user: userId});
        if (!stats) {
            initializeStats(userId);
        }
        const currentOAs = await Application.countDocuments({ user: userId, currentStatus: 'Online Assessment' });
        const currentInterviews = await Application.countDocuments({ user: userId, currentStatus: 'Interview Scheduled' });
        const applications = await Application.countDocuments({ user: userId });
        const rejected = await Application.countDocuments({ user: userId, currentStatus: 'Rejected' });

        res.status(200).json({
            onlineassessments: stats ? stats.onlineassessments : 0,
            interviews: stats ? stats.interviews : 0,
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

/* Notes API Calls */
app.put('/applications/:id/notes', async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const application = await Application.findByIdAndUpdate(id, { notes }, { new: true });
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notes' });
    }
});

app.get('/applications/:id/notes', async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        res.status(200).json(application.notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

/* Notes API Calls End */
// /* CSV Upload API Calls */
app.post('/import-csv', upload.single('csvFile'), async (req, res) => {
    const { roleColumn, companyColumn, dateAppliedColumn, statusColumn } = req.body;
    const userId = req.query.userId; 
    const statusMappings = {
        applied: req.body['statusMappings.applied'] || 'Applied',
        onlineAssessment: req.body['statusMappings.onlineAssessment'] || 'Online Assessment',
        interviewScheduled: req.body['statusMappings.interviewScheduled'] || 'Interview Scheduled',
        interviewed: req.body['statusMappings.interviewed'] || 'Interviewed',
        offerReceived: req.body['statusMappings.offerReceived'] || 'Offer Received',
        offerAccepted: req.body['statusMappings.offerAccepted'] || 'Offer Accepted',
        rejected: req.body['statusMappings.rejected'] || 'Rejected'
    };
    const currentStatusDict = new Map([
        ['applied', 'Applied'],
        ['onlineAssessment', 'Online Assessment'],
        ['interviewScheduled', 'Interview Scheduled'],
        ['interviewed', 'Interviewed'],
        ['offerReceived', 'Offer Received'],
        ['offerAccepted', 'Offer Accepted'],
        ['rejected', 'Rejected']
    ]);
    const results = [];
    let missingColumns = [];
    const stream = fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('headers', (headers) => {
            const requiredColumns = [roleColumn, companyColumn, dateAppliedColumn, statusColumn];
            missingColumns = requiredColumns.filter(column => !headers.includes(column));

            if (missingColumns.length > 0) {
                console.log('Missing columns:', missingColumns);
                stream.destroy();
                return res.status(400).json({
                    error: `Missing columns: ${missingColumns.join(', ')}`
                });
            }
        })        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const role = row[roleColumn];
                    const company = row[companyColumn];
                    const dateApplied = row[dateAppliedColumn];
                    if (!role || !company || !dateApplied) {
                        console.log('Skipping row:', row);
                        continue;
                    }
                    const status = row[statusColumn];
                    
                    // Map status to predefined statuses
                    const currentStatus = currentStatusDict.get(Object.keys(statusMappings).find(
                        key => statusMappings[key] === status
                    )) || 'Applied'; // Default to 'Applied' if status is not found

                    
                    
                    // Gather other columns as notes
                    const notes = {};
                    for (const key in row) {
                        if (![roleColumn, companyColumn, dateAppliedColumn, statusColumn].includes(key)) {
                            notes[key] = row[key];
                        }
                    }
                    console.log('Application Detected:', { role, company, dateApplied, currentStatus, userId, notes });
                    const application = new Application({
                        role,
                        company,
                        dateApplied,
                        currentStatus,
                        user: userId,
                        notes: JSON.stringify(notes) // Store notes as a JSON string
                    });
                    
                    await application.save();
                    await updateStats(userId, currentStatus); // Update stats for each application
                }

                // Clean up the uploaded file
                fs.unlinkSync(req.file.path);
                
                res.status(200).json({ message: 'CSV data imported successfully' });
            } catch (error) {
                console.error('Error importing CSV data:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
// /* CSV Upload API Calls End */


app.listen(3000, () => {
    console.log('Server running at https://lakshyag42.alwaysdata.net/');
});

// app.listen(port, ip, () => {
//     console.log(`Server running at http://${ip}:${port}/`);
//   });

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})


