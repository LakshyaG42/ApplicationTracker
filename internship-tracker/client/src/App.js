import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import AppContainer from './components/AppContainer'; 
import Stats from './components/Stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import "./styles.css";

const App = () => {
    const [applications, setApplications] = useState([]);

    const [stats, setStats] = useState({
      onlineassessments: 0,
      interviews: 0,
      applications: 0,
      offersreceived: 0,
      rejected: 0,
    });


    const fetchApplications = async () => {
      try {
          const response = await axios.get('http://localhost:3000/applications');
          setApplications(response.data);
      } catch (error) {
          console.error('Error fetching applications:', error);
      }
    };
    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:3000/stats');
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
          <br></br>
          <AppContainer>
            <Stats stats = {stats}/> {}
          </AppContainer>
          <br></br>
          <AppContainer>
            <h1>Internship Tracker</h1>
            <ApplicationForm setApplications={setApplications} /> {}
          </AppContainer>
          <br></br>
          <AppContainer>
            <ApplicationList applications={applications} setApplications={setApplications} fetchStats={fetchStats} /> {}
          </AppContainer>
        </Container>
    );
};

export default App;
