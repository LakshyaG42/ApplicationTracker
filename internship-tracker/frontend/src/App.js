import React, { useState, useEffect } from 'react';


import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import AppContainer from './components/AppContainer'; 
import Stats from './components/Stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import "./styles.css";
import styled from 'styled-components';
import Login from './components/Login';

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* Adjust the gap to control padding between buttons */
`;

const CustomRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
  `;

const ApplicationListContainer = styled(AppContainer)`
  min-height: 45vh;
`;

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
    const handleSample = () => {
        localStorage.setItem('userId', "0");
        setIsLoggedIn(true); // Assuming user is logged in
        fetchApplications();
        fetchStats();
    };

    const handleLogout = async () => {
        await axios.get('https://lakshyag42.alwaysdata.net/logout');
        localStorage.setItem('userId', "0");
        setIsLoggedIn(false); // Log user out
      };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
      console.log('Google login success:', credentialResponse);
      try {
          const response = await axios.post('https://lakshyag42.alwaysdata.net/auth/google', {
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
          const response = await axios.get('https://lakshyag42.alwaysdata.net/applications', {
            params: { userId: localStorage.getItem('userId') }
        });
          setApplications(response.data);
      } catch (error) {
          console.error('Error fetching applications:', error);
      }
    };
    const fetchStats = async () => {
        try {
            const response = await axios.get('https://lakshyag42.alwaysdata.net/stats', {
              params: { userId: localStorage.getItem('userId') }
          });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
      if (isLoggedIn) {
          console.log('User is logged in. Fetching data...');
          fetchApplications();
          fetchStats();
      }
  }, [isLoggedIn]);

    useEffect(() => {
      fetchStats();
    }, [applications]);
    
    return (
      <Container>
          {/* Conditional rendering based on isLoggedIn state */}
          {isLoggedIn ? (
            <>
              <AppContainer className="statsContainer"> 
                <Stats stat = {stats}/> {}
              </AppContainer>

              <AppContainer>
                <CustomRow>
                  <Col>
                  <h1>Internship Tracker</h1> 
                  </Col>
                  <Col className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={handleLogout}>Logout</Button> 
                  </Col>
                </CustomRow>
                <ApplicationForm setApplications={setApplications} /> {}
              </AppContainer>

              <ApplicationListContainer >
                <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} /> {}
              </ApplicationListContainer>
            </>
          ) : (
            <>
              {/* <AppContainer>
                <Alert variant="danger">You are not logged in. Please log in to access the application.</Alert>
                <ButtonContainer>
                  <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
                  <Button variant="primary" onClick={handleSample}>Sample Data</Button>
                </ButtonContainer>                  
              </AppContainer> */}
              <Login handleSample={handleSample} onGoogleSuccess={handleGoogleLoginSuccess} onGoogleFailure={handleGoogleLoginFailure}/>
              
              
            </>
        )}
           
        </Container>
    );
};

export default App;
