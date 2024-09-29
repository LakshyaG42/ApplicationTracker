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
import MediaQuery from 'react-responsive';


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
    const openInNewTab = (url) => {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    }

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
        <MediaQuery minWidth={1024}>
          {/* Conditional rendering based on isLoggedIn state */}
          {isLoggedIn ? (
            <Container style={{ overflowX: 'hidden', overflowY: 'scroll', maxHeight: '100vh', maxWidth: '100wh'}}>
              <AppContainer className="statsContainer"> 
                <Stats stat = {stats}/>
              </AppContainer>

              <AppContainer>
                <CustomRow>
                  <Col className="d-flex align-items-end"> 
                  <h1>Application Tracker</h1> 
                  <Button style = {{margin: "10px"}}onClick={()=> openInNewTab("https://www.lakshyagour.com/application-tracker")}>Learn More</Button>
                  </Col>
                  <Col xs lg="2" className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={handleLogout}>Logout</Button> 
                  </Col>
                </CustomRow>
                
                <ApplicationForm setApplications={setApplications} /> {}
              </AppContainer>

              <ApplicationListContainer >
                <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} /> {}
              </ApplicationListContainer>
            </Container>
          ) : (
            <>
              {/* Display login component if user is not logged in */}
              <Login handleSample={handleSample} onGoogleSuccess={handleGoogleLoginSuccess} onGoogleFailure={handleGoogleLoginFailure}/>
            </>
        )}
        </MediaQuery>
        <MediaQuery minWidth={768} maxWidth={1023}>
           {/* Tablet Horizontal View */}
          {isLoggedIn ? (
            <>
             <Container style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '100vh', maxWidth: '100wh'}}>
              <AppContainer className="statsContainer"> 
                <Stats stat = {stats}/>
              </AppContainer>

              <AppContainer>
                <Row>
                  <Col md="auto">
                    <h1>Application Tracker</h1>
                    
                  </Col>
                  <Col>
                    <Button onClick={()=> openInNewTab("https://www.lakshyagour.com/application-tracker")}>Learn More</Button>
                  </Col>
                  <Col xs lg="2">
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                  </Col>
                </Row>
                <ApplicationForm setApplications={setApplications} />
              </AppContainer>

              <ApplicationListContainer>
                <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} />
              </ApplicationListContainer>
              </Container>
            </>
          ) : (
            <Login handleSample={handleSample} onGoogleSuccess={handleGoogleLoginSuccess} onGoogleFailure={handleGoogleLoginFailure}/>
          )}
          
        </MediaQuery>
        <MediaQuery maxWidth={767}>
           {/* Mobile View */}
          {isLoggedIn ? (
            <>
            <Container style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
              <AppContainer> 
                <Stats stat = {stats}/>
              </AppContainer>

              <AppContainer>
                <Row>
                  <Col md="auto">
                    <h1>Application Tracker</h1>

                 </Col>
                 <Col>
                  <Button onClick={()=> openInNewTab("https://www.lakshyagour.com/application-tracker")}>Learn More</Button>
                 </Col>
                  <Col xs lg="2">
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                  </Col>
                </Row>
                <ApplicationForm setApplications={setApplications} />
              </AppContainer>

              <AppContainer style={{height:"20rem"}}>
                <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} />
              </AppContainer>
            </Container>
            </>
          ) : (
            <Login handleSample={handleSample} onGoogleSuccess={handleGoogleLoginSuccess} onGoogleFailure={handleGoogleLoginFailure}/>
          )}
        </MediaQuery>
      </Container>
    );
};

export default App;
