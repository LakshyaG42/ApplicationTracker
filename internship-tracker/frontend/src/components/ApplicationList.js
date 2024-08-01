import React, { useState } from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import FlipMove from 'react-flip-move';
import NotesPopup from './NotesPopup';
import './ApplicationList.css';
import styled from 'styled-components';


const Col2 = styled(Col)`
    padding-right: 5px;
    padding-left: 5px;
`   

const ApplicationList = ({ applications, setApplications, fetchStats }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortDirection, setSortDirection] = useState('desc');
    const [showNotesPopup, setShowNotesPopup] = useState(false);
    const [currentNotes, setCurrentNotes] = useState('');
    const [currentAppId, setCurrentAppId] = useState(null);

    /** Notes Functions */

    const handleNotesOpen = async (appId) => {
        console.log('Opening notes for application:', appId);
        setCurrentAppId(appId);
        try {
            const response = await axios.get(`https://lakshyag42.alwaysdata.net/applications/${appId}/notes`);
            console.log('Notes:', response.data);
            setCurrentNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
        setShowNotesPopup(true);
    };

    const handleNotesSave = async (notes) => {
        try {
            await axios.put(`https://lakshyag42.alwaysdata.net/applications/${currentAppId}/notes`, { notes });
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === currentAppId ? { ...app, notes } : app
                )
            );
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };



    /** Notes Functions End */


    const updateStats = async (userId, action) => {
        try {
            const response = await axios.post('https://lakshyag42.alwaysdata.net/stats', { userId, action });
            console.log(response.data.message); // Log success message
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    };
    const handleStatusChange = async (id, newStatus) => {
        console.log('Changing status:', id, newStatus);
        try {
            await axios.put(`https://lakshyag42.alwaysdata.net/applications/${id}`, 
                { currentStatus: newStatus },
                { params: { userId: localStorage.getItem('userId') } }
            );
            console.log('Status updated successfully.');
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === id ? { ...app, currentStatus: newStatus } : app
                )
            );
            
            updateStats(localStorage.getItem('userId'), newStatus); 
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://lakshyag42.alwaysdata.net/applications/${id}`);
            const updatedApplications = applications.filter(app => app._id !== id);
            setApplications(updatedApplications);
            fetchStats(); 
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortDirection(e.target.value);
    };

    const filteredApplications = applications.filter(app => 
        filterStatus === 'All' || app.currentStatus === filterStatus
    );

    const sortedApplications = [...filteredApplications].sort((a, b) => {
        const dateA = new Date(a.dateApplied);
        const dateB = new Date(b.dateApplied);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

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
                <h2>Current Applications</h2>
                </Col>
                <Col xs="2">
                    <Form.Select onChange={handleSortChange} value={sortDirection}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </Form.Select>           
                </Col>
                <Col xs="3">
                    <Form.Select onChange={handleFilterChange} value={filterStatus}>
                        <option value="All">All</option>
                        <option value="Applied">Applied</option>
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Offer Accepted">Offer Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </Form.Select>
                </Col>
            </Row>
            <div className="scrollable-list-container">
            <Row>
                <Col>
                    <TransitionGroup component={ListGroup}>
                        <FlipMove>
                            {sortedApplications.map((app) => (
                                <CSSTransition
                                key={app._id}
                                timeout={500}
                                classNames="fade"
                                >
                                    <ListGroup.Item
                                        key={app._id}
                                        style={{ backgroundColor: getBackgroundColor(app.currentStatus) }}
                                    >
                                        <Row>
                                            <Col>
                                                {app.role} at {app.company} - Applied on {new Date(app.dateApplied).toUTCString().substring(4,16)}
                                            </Col>
                                            <Col2 xs="3">
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
                                            </Col2>
                                            <Col2 xs="auto">
                                                <Button variant="secondary" onClick={() => handleNotesOpen(app._id)}>Notes</Button>
                                            </Col2>
                                            <Col2 xs="auto">
                                                <Button variant="danger" onClick={() => handleDelete(app._id)}>Delete</Button>
                                            </Col2>
                                        </Row>
                                    </ListGroup.Item>
                                </CSSTransition>
                            ))}
                        </FlipMove>
                    </TransitionGroup>   
                </Col>
            </Row>
            </div>
            <NotesPopup
                show={showNotesPopup}
                handleClose={() => setShowNotesPopup(false)}
                saveNotes={handleNotesSave}
                initialNotes={currentNotes}
            />
        </Container>
    );
};

export default ApplicationList;
