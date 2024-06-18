import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';

const App = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:3000/applications');
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div>
            <h1>Internship Tracker</h1>
            <ApplicationForm />
            <h2>My Applications</h2>
            <ApplicationList applications={applications} />
        </div>
    );
};

export default App;
