import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Papa from 'papaparse';

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
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const headers = results.meta.fields;
                    detectColumns(headers, results.data);
                }
            });
        }
    };


    const detectColumns = (headers, data) => {
        const detectRoleColumns = headers.filter(header => 
            /role|position|occupation|job title|job|title|jobrole|jobtitle|job_position|positiontitle|job_position_title|job_title|occupation_title|role_title|work_title|job_role|position_role|job_role_title|jobtitlerole|job_title_role|job_position_role|role_position|jobtitle_position|job_role_position/i.test(header.toLowerCase())
          );
          
          const detectCompanyColumns = headers.filter(header => 
            /company|organization|employer|companyname|employername|organizationname|business|firm|corporation|companytitle|company_org|org|employertitle|employer_org|company_employer|employer_company|company_organization|orgname|company_firm|company_business|orgtitle|employer_firm|businessname|companycorp|org_employer/i.test(header.toLowerCase())
          );
          
          const detectDateAppliedColumns = headers.filter(header => 
            /date|date applied|application date|applied on|applieddate|dateofapplication|application_date|applied_date|date_applied|date_of_application|date_submitted|submissiondate|appdate|date_application|application_submission_date|dateofapply|date_app|applied_date_on|date_application_submitted|applied_on_date|date_of_submission|app_date|date_applied_on|applicationdateapplied|application_date_applied/i.test(header.toLowerCase())
          );
          
          const detectStatusColumns = headers.filter(header => 
            /status|application status|current status|appstatus|statusofapplication|application_status|current_status|status_app|application_status_current|applicationcurrentstatus|status_current|statusofapp|statusapplication|app_status|app_current_status|application_current_status|status_application|status_app_current|currentappstatus|current_app_status|app_status_current|currentapplicationstatus|app_currentstatus|statuscurrent|currentapplication_status/i.test(header.toLowerCase())
          );

        setRoleColumn(detectRoleColumns.length >= 1 ? detectRoleColumns[0] : '');
        setCompanyColumn(detectCompanyColumns.length >= 1 ? detectCompanyColumns[0] : '');
        setDateAppliedColumn(detectDateAppliedColumns.length >= 1 ? detectDateAppliedColumns[0] : '');
        setStatusColumn(detectStatusColumns.length >= 1 ? detectStatusColumns[0] : '');
        
        // If multiple columns detected, you may need additional logic to handle this case
        if (detectRoleColumns.length > 1) alert('Multiple role columns detected, please choose one.');
        if (detectCompanyColumns.length > 1) alert('Multiple company columns detected, please choose one.');
        if (detectDateAppliedColumns.length > 1) alert('Multiple date applied columns detected, please choose one.');
        if (detectStatusColumns.length > 1) alert('Multiple status columns detected, please choose one.');
        if (detectStatusColumns.length > 0) {
            const statusColumnName = detectStatusColumns[0]; // Use the first detected status column
            const statusVariations = {
                applied: /applied|apply|applied for|application submitted/i,
                onlineAssessment: /online\s*assessment|oa|assessment|online\s*test/i,
                interviewScheduled: /interview\s*scheduled|interview\s*set|interview\s*planned/i,
                interviewed: /interviewed|interview|interview\s*complete|interview\s*done/i,
                offerReceived: /offer\s*received|offer|offer\s*letter/i,
                offerAccepted: /offer\s*accepted|accepted|accepted\s*offer/i,
                rejected: /rejected|rejection|rej|not\s*selected/i
            };
    
            const statusColumnValues = data.map(row => row[statusColumnName]);
            const updatedStatusMappings = {
                applied: '',
                onlineAssessment: '',
                interviewScheduled: '',
                interviewed: '',
                offerReceived: '',
                offerAccepted: '',
                rejected: ''
            };
    
            for (const [statusKey, variations] of Object.entries(statusVariations)) {
                const matchedValue = statusColumnValues.find(value => variations.test(value));
                if (matchedValue) {
                    updatedStatusMappings[statusKey] = matchedValue;
                }
            }

            setStatusMappings(updatedStatusMappings);
            console.log('Detected status mappings:', updatedStatusMappings);
            // Optionally, set statusMappings state or handle mappings as needed
        }
    };

    const handleStatusMappingChange = (e) => {
        setStatusMappings({
            ...statusMappings,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    <Button variant="primary" type="submit">
                        Import CSV
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ImportCSV;
