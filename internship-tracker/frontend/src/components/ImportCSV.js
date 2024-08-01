import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner  } from 'react-bootstrap';
import axios from 'axios';

const ImportCSV = ({ show, handleClose, setApplications }) => {
    const [csvFile, setCsvFile] = useState(null);
    const [roleColumn, setRoleColumn] = useState('');
    const [companyColumn, setCompanyColumn] = useState('');
    const [dateAppliedColumn, setDateAppliedColumn] = useState('');
    const [statusColumn, setStatusColumn] = useState('');
    const [statusMappings, setStatusMappings] = useState({
        applied: '',
        onlineAssessment: '',
        interviewScheduled: '',
        interviewed: '',
        offerReceived: '',
        offerAccepted: '',
        rejected: ''
    });
    const [loading, setLoading] = useState(false);
    
    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleStatusMappingChange = (e) => {
        setStatusMappings({
            ...statusMappings,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('csvFile', csvFile);
        formData.append('roleColumn', roleColumn);
        formData.append('companyColumn', companyColumn);
        formData.append('dateAppliedColumn', dateAppliedColumn);
        formData.append('statusColumn', statusColumn);
        Object.keys(statusMappings).forEach(key => {
            if (statusMappings[key]) {
                formData.append(`statusMappings.${key}`, statusMappings[key]);
            }
        });

        try {
            await axios.post('https://lakshyag42.alwaysdata.net/import-csv', formData, {
                params: { userId: localStorage.getItem('userId') },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const response = await axios.get('https://lakshyag42.alwaysdata.net/applications', {
                params: { userId: localStorage.getItem('userId') }
            });
            console.log('Imported applications:', response.data);
            setApplications(response.data);
            handleClose();
        } catch (error) {
            console.error('Error importing CSV data:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('An unexpected error occurred');
            }
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Import CSV</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload CSV File</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} required />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="formRoleColumn" className="mb-3">
                                <Form.Label>Role Column Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={roleColumn}
                                    onChange={(e) => setRoleColumn(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formCompanyColumn" className="mb-3">
                                <Form.Label>Company Column Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={companyColumn}
                                    onChange={(e) => setCompanyColumn(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formDateAppliedColumn" className="mb-3">
                                <Form.Label>Date Applied Column Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={dateAppliedColumn}
                                    onChange={(e) => setDateAppliedColumn(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatusColumn" className="mb-3">
                                <Form.Label>Status Column Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={statusColumn}
                                    onChange={(e) => setStatusColumn(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formStatusMappings" className="mb-3">
                        <Form.Label>Specify what your data should map to:</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="applied"
                                    value={statusMappings.applied}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Applied Data Name"
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="onlineAssessment"
                                    value={statusMappings.onlineAssessment}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Online Assessment Data Name"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="interviewScheduled"
                                    value={statusMappings.interviewScheduled}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Interview Scheduled Data Name"
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="interviewed"
                                    value={statusMappings.interviewed}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Interviewed Data Name"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="offerReceived"
                                    value={statusMappings.offerReceived}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Offer Received Data Name"
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="offerAccepted"
                                    value={statusMappings.offerAccepted}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Offer Accepted Data Name"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="rejected"
                                    value={statusMappings.rejected}
                                    onChange={handleStatusMappingChange}
                                    placeholder="Rejected Data Name"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                {' '}Importing...
                            </>
                        ) : (
                            'Import CSV'
                        )}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ImportCSV;
