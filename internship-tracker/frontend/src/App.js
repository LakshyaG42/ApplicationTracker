import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import AppContainer from './components/AppContainer'; 
import Stats from './components/Stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Alert } from 'react-bootstrap';
import "./styles.css";
import GoogleLoginButton from './components/GoogleLoginButton';


const App = () => {
    const [applications, setApplications] = useState([]);

    const [stats, setStats] = useState({
      onlineassessments: 0,
      interviews: 0,
      applications: 0,
      offersreceived: 0,
      rejected: 0,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
    const handleLogin = () => {
        setIsLoggedIn(true); // Assuming user is logged in
    };

    const handleLogout = () => {
        
        setIsLoggedIn(false); // Log user out
      };

      const handleGoogleLoginSuccess = async (credentialResponse) => {
        console.log('Google login success:', credentialResponse);
    
        try {
            const response = await axios.post('http://localhost:3000/auth/google', {
                tokenId: credentialResponse.credential,
            });
            console.log('Server response:', response.data);
            setIsLoggedIn(true); // Update login status in the client
            // Fetch user-specific data after login (applications, stats, etc.)
            console.log('User ID:', response.data.userId);
            localStorage.setItem('userId', response.data.userId);
            fetchApplications();
            fetchStats();
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };
    const handleGoogleLoginFailure = (error) => {
        console.error('Google login error:', error);
        // Handle login failure (e.g., display error message)
    };


    const fetchApplications = async () => {
      try {
          const response = await axios.get('http://localhost:3000/applications', {
            params: { userId: localStorage.getItem('userId') }
        });
          setApplications(response.data);
      } catch (error) {
          console.error('Error fetching applications:', error);
      }
    };
    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:3000/stats', {
              params: { userId: localStorage.getItem('userId') }
          });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchStats();
    }, []);

    return (
        <Container>
          {/* Conditional rendering based on isLoggedIn state */}
          {isLoggedIn ? (
            <>
              <AppContainer>
                <Stats stats = {stats}/> {}
              </AppContainer>

              <AppContainer>
                <h1>Internship Tracker</h1>
                <ApplicationForm setApplications={setApplications} /> {}
              </AppContainer>

              <AppContainer>
                <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} /> {}
              </AppContainer>

            </>
          ) : (
            <>
              <Alert variant="danger">You are not logged in. Please log in to access the application.</Alert>
              < GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
              <button onClick={handleLogin}> Login </button>
            </>
        )}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}  
        </Container>
    );
};

export default App;
