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
const WEBSITE_URL = process.env.NODE_ENV === 'production' ? process.env.WEBSITE_URL_PROD : process.env.WEBSITE_URL_DEV;

//const StatusChangeLog = require('./models/StatusChangeLog');

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
    callbackURL: `${WEBSITE_URL}auth/google/callback`
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
          redirect_uri: `${WEBSITE_URL}auth/google/callback`,
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
    console.log('Updating stats for user:', userId);
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
        const userId = req.query.userId; // Assuming req.user contains the authenticated user object

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

/*
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
*/ 
app.listen(port, ip, () => {
    console.log(`Server running at http://${ip}:${port}/`);
  });

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})


