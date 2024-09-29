import React, { useState } from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import FlipMove from 'react-flip-move';
import NotesPopup from './NotesPopup';
import './ApplicationList.css';
import styled from 'styled-components';
import DateModal from './DateModal';
import MediaQuery from 'react-responsive';

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
    const [searchCompany, setSearchCompany] = useState('');
    const [searchRole, setSearchRole] = useState('');


    const [oaDueDate, setOaDueDate] = useState(null);
    const [interviewDate, setInterviewDate] = useState(null);
    const [oaCompleted, setOaCompleted] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [currentEditType, setCurrentEditType] = useState(null); // 'oa' or 'interview'

    /** Notes Functions */

    const handleNotesOpen = async (appId) => {
        console.log('Opening notes for application:', appId);
        setCurrentAppId(appId);
        try {
            const response = await axios.get(`https://lakshyag42.alwaysdata.net/applications/${appId}/notes`);
            console.log('Notes:', response.data);
            setCurrentNotes(response.data);

            const response2 = await axios.get(`https://lakshyag42.alwaysdata.net/applications/${appId}/dates`);
            console.log('Dates:', response2.data);
            setOaDueDate(response2.data.oaDueDate);
            setInterviewDate(response2.data.interviewDate);
            setOaCompleted(response2.data.oaCompleted);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
        setShowNotesPopup(true);
    };

    const handleNotesSave = async (notes, oaDueDate, interviewDate, oaCompleted) => {
        try {
            await axios.put(`https://lakshyag42.alwaysdata.net/applications/${currentAppId}/notes`, { notes });
            await axios.put(`https://lakshyag42.alwaysdata.net/applications/${currentAppId}/dates`, { oaDueDate, interviewDate, oaCompleted });
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === currentAppId ? { ...app, notes, oaDueDate, interviewDate, oaCompleted } : app
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

    const handleStatusChange = async (id, newStatus, oaDueDate, interviewDate, oaCompleted) => {
        console.log('Changing status:', id, newStatus);
        try {
            const payload = { currentStatus: newStatus };
            if (newStatus === 'Online Assessment') {
                payload.oaDueDate = oaDueDate;
                payload.oaCompleted = oaCompleted;
            } else if (newStatus === 'Interview Scheduled') {
                payload.interviewDate = interviewDate;
            }
            
            await axios.put(`https://lakshyag42.alwaysdata.net/applications/${id}`, 
                payload,
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

    const openDateModal = (id, newStatus) => {
        if (newStatus === 'Online Assessment' || newStatus === 'Interview Scheduled') {
            setCurrentAppId(id);
            setCurrentEditType(newStatus === 'Online Assessment' ? 'oa' : 'interview');
            setShowDateModal(true);
        } else {
            handleStatusChange(id, newStatus);
        }
    };
    
    const handleSaveDates = (id, newStatus, oaDueDate, interviewDate, oaCompleted) => {
        handleStatusChange(id, newStatus, oaDueDate, interviewDate, oaCompleted);
        setShowDateModal(false);
    };

    const filteredApplications = applications.filter(app => 
        (filterStatus === 'All' || app.currentStatus === filterStatus) &&
        app.company.toLowerCase().includes(searchCompany.toLowerCase()) &&
        app.role.toLowerCase().includes(searchRole.toLowerCase())
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
        <Container className='applicationsContainer'>
            <MediaQuery minWidth={1440}> {/* Render only on desktop */}
                <Row>
                    <Col xs="2">
                    <h2>Applications</h2>
                    </Col>
                    <Col xs="3">
                        <Form.Control
                            type="text"
                            placeholder="Search by Company"
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                        />
                    </Col>
                    <Col xs="3">
                        <Form.Control
                            type="text"
                            placeholder="Search by Role"
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                        />
                    </Col>
                    <Col xs="2">
                        <Form.Select onChange={handleSortChange} value={sortDirection}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>           
                    </Col>
                    <Col xs="2">
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
                                                <Col lg="5" className='role' style={{overflowY: 'hidden', overflowX: 'scroll'}}>
                                                    <strong>{app.role}</strong>
                                                </Col >
                                                <Col style={{overflowY: 'hidden'}}>
                                                @ <strong>{app.company}</strong>
                                                </Col>
                                                <Col2 xs="3">
                                                    <Form.Select
                                                        value={app.currentStatus}
                                                        onChange={(e) => openDateModal(app._id, e.target.value)}
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
                                            <Row style={{marginTop: '-15px'}}>
                                                <Col>
                                                    <small className="text-muted" style={{ fontStyle: 'italic' }}>
                                                        Applied on {new Date(app.dateApplied).toUTCString().substring(4, 16)}      
                                                    </small>
                                                    {app.currentStatus === 'Online Assessment' && (
                                                    <small className="oaDates" style={{ fontStyle: 'italic' }}>
                                                        &emsp;{app.oaDueDate ? (
                                                            app.oaCompleted ? 'Assessment Completed' : `Assessment Due Date: ${new Date(app.oaDueDate).toUTCString().substring(4, 16)}`
                                                        ) : 'Assessment Due Date: null'}
                                                    </small>
                                                    )}
                                                    {app.currentStatus === 'Interview Scheduled' && (
                                                        <small className="interviewDates" style={{ fontStyle: 'italic' }}>
                                                            &emsp;
                                                        {app.interviewDate ? `Interview Date: ${new Date(app.interviewDate).toUTCString().substring(4, 16)}` : 'Interview Date: not set'}
                                                        </small>
                                                    )}
                                                </Col>
                                                
                                                
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
                    initialOaDueDate={oaDueDate}
                    initialOaCompleted={oaCompleted}
                    initialInterviewDate={interviewDate}
                />
                <DateModal
                    show={showDateModal}
                    handleClose={() => setShowDateModal(false)}
                    appId={currentAppId}
                    editType={currentEditType}
                    handleSave={handleSaveDates}
                />
            </MediaQuery>

            <MediaQuery minWidth={1024} maxWidth={1439} > {/* Render only on laptop/tablet/smalldesktop */}
                <Container>
                <Row>
                    <Col xs="5">
                    <h2>Applications</h2>
                    </Col>
                    <Col>
                        <Form.Select onChange={handleSortChange} value={sortDirection}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>           
                    </Col>
                    <Col>
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
                <Row>
                    <Col xs="">
                        <Form.Control
                            type="text"
                            placeholder="Search by Company"
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                        />
                    </Col>
                    <Col xs="" style={{paddingBottom: "10px"}}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Role"
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                        />
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
                                                <Col  xs="4" className='role' style={{}}>
                                                    <strong>{app.role}</strong>
                                                </Col >
                                                <Col sm="2" style={{overflow: 'hidden'}}>
                                                @ <strong>{app.company}</strong>
                                                </Col>
                                                <Col2 sm="3">
                                                    <Form.Select
                                                        value={app.currentStatus}
                                                        onChange={(e) => openDateModal(app._id, e.target.value)}
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
                                                <Col2 style={{paddingLeft:"10px", paddingRight:"10px",}}>
                                                    <Button variant="secondary" onClick={() => handleNotesOpen(app._id)}>Notes</Button>
                                                </Col2>
                                                <Col2 style={{paddingLeft:"10px", paddingRight:"10px",}}>
                                                    <Button variant="danger" onClick={() => handleDelete(app._id)}>Delete</Button>
                                                </Col2>
                                            </Row>
                                            <Row style={{marginTop: '-10px'}}>
                                                <Col>
                                                    <small className="text-muted" style={{ fontStyle: 'italic' }}>
                                                        Applied on {new Date(app.dateApplied).toUTCString().substring(4, 16)}      
                                                    </small>
                                                    {app.currentStatus === 'Online Assessment' && (
                                                    <small className="oaDates" style={{ fontStyle: 'italic' }}>
                                                        &emsp;{app.oaDueDate ? (
                                                            app.oaCompleted ? 'Assessment Completed' : `Assessment Due Date: ${new Date(app.oaDueDate).toUTCString().substring(4, 16)}`
                                                        ) : 'Assessment Due Date: null'}
                                                    </small>
                                                    )}
                                                    {app.currentStatus === 'Interview Scheduled' && (
                                                        <small className="interviewDates" style={{ fontStyle: 'italic' }}>
                                                            &emsp;
                                                        {app.interviewDate ? `Interview Date: ${new Date(app.interviewDate).toUTCString().substring(4, 16)}` : 'Interview Date: not set'}
                                                        </small>
                                                    )}
                                                </Col>
                                                
                                                
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
                    initialOaDueDate={oaDueDate}
                    initialOaCompleted={oaCompleted}
                    initialInterviewDate={interviewDate}
                />
                <DateModal
                    show={showDateModal}
                    handleClose={() => setShowDateModal(false)}
                    appId={currentAppId}
                    editType={currentEditType}
                    handleSave={handleSaveDates}
                />
                </Container>
            </MediaQuery>


            <MediaQuery minWidth={768} maxWidth={1023}> {/* Render only on tablet */}
                <Row>
                    <Col xs="5">
                    <h2>Applications</h2>
                    </Col>
                    <Col>
                        <Form.Select onChange={handleSortChange} value={sortDirection}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>           
                    </Col>
                    <Col>
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
                <Row>
                    <Col xs="">
                        <Form.Control
                            type="text"
                            placeholder="Search by Company"
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                        />
                    </Col>
                    <Col xs="" style={{paddingBottom: "10px"}}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Role"
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                        />
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
                                                <Col md="5" className='role' style={{overflow: 'auto'}}>
                                                    <strong>{app.role}</strong>
                                                </Col >
                                                <Col md="3" className='role' style={{overflow: 'auto'}}>
                                                @ <strong>{app.company}</strong>
                                                </Col>
                                                <Col2 xs="4">
                                                    <Form.Select
                                                        value={app.currentStatus}
                                                        onChange={(e) => openDateModal(app._id, e.target.value)}
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
                                                
                                            </Row>
                                            <Row style={{marginTop: '-8px'}}>
                                                <Col2 xs="auto">
                                                    <Button variant="secondary" onClick={() => handleNotesOpen(app._id)}>Notes</Button>
                                                </Col2>
                                                <Col2 xs="auto">
                                                    <Button variant="danger" onClick={() => handleDelete(app._id)}>Delete</Button>
                                                </Col2>
                                                <Col sm="8" style={{marginTop: '10px'}}>
                                                    <small className="text-muted" style={{ fontStyle: 'italic', fontSize : '1rem' }}>
                                                        Applied on {new Date(app.dateApplied).toUTCString().substring(4, 16)}      
                                                    </small>
                                                    {app.currentStatus === 'Online Assessment' && (
                                                    <small className="oaDates" style={{ fontStyle: 'italic' }}>
                                                        &emsp;{app.oaDueDate ? (
                                                            app.oaCompleted ? 'Assessment Completed' : `Assessment Due Date: ${new Date(app.oaDueDate).toUTCString().substring(4, 16)}`
                                                        ) : 'Assessment Due Date: null'}
                                                    </small>
                                                    )}
                                                    {app.currentStatus === 'Interview Scheduled' && (
                                                        <small className="interviewDates" style={{ fontStyle: 'italic' }}>
                                                            &emsp;
                                                        {app.interviewDate ? `Interview Date: ${new Date(app.interviewDate).toUTCString().substring(4, 16)}` : 'Interview Date: not set'}
                                                        </small>
                                                    )}
                                                </Col>
                                                
                                                
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
                    initialOaDueDate={oaDueDate}
                    initialOaCompleted={oaCompleted}
                    initialInterviewDate={interviewDate}
                />
                <DateModal
                    show={showDateModal}
                    handleClose={() => setShowDateModal(false)}
                    appId={currentAppId}
                    editType={currentEditType}
                    handleSave={handleSaveDates}
                />
            </MediaQuery>

            <MediaQuery maxWidth={767}> {/* Render only on mobile */}
                <Row>
                    <Col xs="2">
                    <h2>Applications</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md="auto">
                        <Form.Control
                            type="text"
                            placeholder="Search by Company"
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search by Role"
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm="2">
                        <Form.Select onChange={handleSortChange} value={sortDirection}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>           
                    </Col>
                    <Col >
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
                                                <Col lg="5" className='role'>
                                                    <strong>{app.role}</strong>
                                                </Col >
                                            </Row>
                                            <Row>
                                                <Col style={{overflow: 'hidden',}}>
                                                @ <strong>{app.company}</strong>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <small className="text-muted" style={{ fontStyle: 'italic' }}>
                                                        Applied on {new Date(app.dateApplied).toUTCString().substring(4, 16)}      
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row style={{marginBottom:".1rem"}}>
                                                    {app.currentStatus === 'Online Assessment' && (
                                                    <small className="oaDates" style={{ fontStyle: 'italic' }}>
                                                        &emsp;{app.oaDueDate ? (
                                                            app.oaCompleted ? 'Assessment Completed' : `Assessment Due Date: ${new Date(app.oaDueDate).toUTCString().substring(4, 16)}`
                                                        ) : 'Assessment Due Date: null'}
                                                    </small>
                                                    )}
                                                    {app.currentStatus === 'Interview Scheduled' && (
                                                        <small className="interviewDates" style={{ fontStyle: 'italic' }}>
                                                            &emsp;
                                                        {app.interviewDate ? `Interview Date: ${new Date(app.interviewDate).toUTCString().substring(4, 16)}` : 'Interview Date: not set'}
                                                        </small>
                                                    )}
                                            </Row>
                                            <Row style={{marginBottom:".5rem"}}>
                                                <Col2>
                                                    <Form.Select
                                                        value={app.currentStatus}
                                                        onChange={(e) => openDateModal(app._id, e.target.value)}
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
                                            </Row>
                                            <Row>
                                                <Col2>
                                                    <Button variant="secondary" onClick={() => handleNotesOpen(app._id)}>Notes</Button>
                                                </Col2>
                                                <Col2 className="d-flex justify-content-end">
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
                    initialOaDueDate={oaDueDate}
                    initialOaCompleted={oaCompleted}
                    initialInterviewDate={interviewDate}
                />
                <DateModal
                    show={showDateModal}
                    handleClose={() => setShowDateModal(false)}
                    appId={currentAppId}
                    editType={currentEditType}
                    handleSave={handleSaveDates}
                />
            </MediaQuery>
        </Container>
    );
};

export default ApplicationList;
