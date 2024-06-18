import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';


const ApplicationForm = ({ setApplications }) => {
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [dateApplied, setDateApplied] = useState(new Date().toISOString().substr(0, 10)); // Default to today's date
    const [currentStatus, setCurrentStatus] = useState('Applied');
    const [existingRoles, setExistingRoles] = useState([]);
    const [existingCompanies, setExistingCompanies] = useState([]);

    useEffect(() => {
        // Fetch existing roles and companies when the component mounts
        const fetchExistingData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/existing-data'); // Replace with your API endpoint
                setExistingRoles(response.data.roles);
                setExistingCompanies(response.data.companies);
            } catch (error) {
                console.error('Error fetching existing data:', error);
            }
        };

        fetchExistingData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/applications', { role, company, dateApplied, currentStatus });

        try {
            const response = await axios.get('http://localhost:3000/applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications after adding new application:', error);
        }

        try {
            
            const response = await axios.get('http://localhost:3000/applications');
            setApplications(response.data);

            const existingDataResponse = await axios.get('http://localhost:3000/existing-data');
            setExistingRoles(existingDataResponse.data.roles);
            setExistingCompanies(existingDataResponse.data.companies);
        } catch (error) {
            console.error('Error fetching data after submitting form:', error);
        }

        setRole('');
        setCompany('');
        setDateApplied(new Date().toISOString().substr(0, 10)); // Reset to today's date
        setCurrentStatus('Applied');
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col sm={3}>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Role"
                            list="roleList" 
                            required
                        />
                        {}
                        <datalist id="roleList">
                            {existingRoles.map((existingRole, index) => (
                                <option key={index} value={existingRole} />
                            ))}
                        </datalist>
                    </Col>
                    <Col sm={3}>
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Company"
                            list="companyList" // Connect to datalist for autofill
                            required
                        />
                        {/* Datalist for autofill */}
                        <datalist id="companyList">
                            {existingCompanies.map((existingCompany, index) => (
                                <option key={index} value={existingCompany} />
                            ))}
                        </datalist>
                    </Col>
                    <Col sm={3}>
                        <Form.Label>Date Applied</Form.Label>
                        <Form.Control type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} required />
                    </Col>
                    <Col sm={3}>
                        <Form.Label>Current Status</Form.Label>
                        <Form.Control as="select" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} required>
                            <option value="Applied">Applied</option>
                            <option value="Online Assessment">Online Assessment</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Interviewed">Interviewed</option>
                            <option value="Offer Received">Offer Received</option>
                            <option value="Offer Accepted">Offer Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </Form.Control>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-3">
                    Add Application
                </Button>
            </Form>
        </Container>
    );
};

export default ApplicationForm;
