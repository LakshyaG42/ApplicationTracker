import React from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Form, Button } from 'react-bootstrap';

const ApplicationList = ({ applications, setApplications, fetchStats }) => {
    const handleStatusChange = async (id, newStatus) => {
        console.log('Changing status:', id, newStatus);
        try {
            await axios.put(`http://localhost:3000/applications/${id}`, { currentStatus: newStatus });
            console.log('Status updated successfully.');
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === id ? { ...app, currentStatus: newStatus } : app
                )
            );
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/applications/${id}`);
            const updatedApplications = applications.filter(app => app._id !== id);
            setApplications(updatedApplications);
            fetchStats(); 
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const getBackgroundColor = (status) => {
        switch (status) {
            case 'Applied':
                return 'lightblue';
            case 'Online Assessment':
                return '#fab169';
            case 'Interview Scheduled':
                return '#f5f17a';
            case 'Interviewed':
                return '#78de71';
            case 'Offer Received':
            case 'Offer Accepted':
                return '#51e893';
            case 'Rejected':
                return '#d66360';
            default:
                return 'inherit';
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <ListGroup>
                        {applications.map((app) => (
                            <ListGroup.Item
                                key={app._id}
                                style={{ backgroundColor: getBackgroundColor(app.currentStatus) }}
                            >
                                <Row>
                                    <Col>
                                        {app.role} at {app.company} - Applied on {new Date(app.dateApplied).toLocaleDateString()}
                                    </Col>
                                    <Col xs="4">
                                        <Form.Select
                                            value={app.currentStatus}
                                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Online Assessment">Online Assessment</option>
                                            <option value="Interview Scheduled">Interview Scheduled</option>
                                            <option value="Interviewed">Interviewed</option>
                                            <option value="Offer Received">Offer Received</option>
                                            <option value="Offer Accepted">Offer Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs="1">
                                        <Button variant="danger" onClick={() => handleDelete(app._id)}>Delete</Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ApplicationList;
