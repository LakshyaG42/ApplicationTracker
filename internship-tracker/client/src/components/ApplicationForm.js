import React, { useState } from 'react';
import axios from 'axios';

const ApplicationForm = () => {
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [dateApplied, setDateApplied] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/applications', { role, company, dateApplied, currentStatus });
        setRole('');
        setCompany('');
        setDateApplied('');
        setCurrentStatus('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" required />
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required />
            <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} required />
            <input type="text" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} placeholder="Current Status" required />
            <button type="submit">Add Application</button>
        </form>
    );
};

export default ApplicationForm;
