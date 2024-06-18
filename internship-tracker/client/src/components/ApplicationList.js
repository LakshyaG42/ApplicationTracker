import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3000/applications');
            setApplications(result.data);
        };
        fetchData();
    }, []);

    return (
        <ul>
            {applications.map((app) => (
                <li key={app._id}>{app.role} at {app.company} - Applied on {new Date(app.dateApplied).toLocaleDateString()} - Status: {app.currentStatus}</li>
            ))}
        </ul>
    );
};

export default ApplicationList;
