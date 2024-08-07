import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DateModal = ({ show, handleClose, appId, handleSave, editType }) => {
    const [oaDueDate, setOaDueDate] = useState(null);
    const [interviewDate, setInterviewDate] = useState(null);
    const [oaCompleted, setOaCompleted] = useState(false);

    const handleSaveClick = () => {
        const currentStatus = editType === 'oa' ? 'Online Assessment' : 'Interview Scheduled';
        handleSave(appId, currentStatus, oaDueDate, interviewDate, oaCompleted);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editType === 'oa' ? 'Set Online Assessment Due Date' : 'Set Interview Date'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {editType === 'oa' && (
                        <>
                            <Form.Group controlId="oaDueDate">
                                <Form.Label>Online Assessment Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={oaDueDate || ''}
                                    onChange={(e) => setOaDueDate(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="oaCompleted">
                                <Form.Check
                                    type="checkbox"
                                    label="OA Completed"
                                    checked={oaCompleted}
                                    onChange={(e) => setOaCompleted(e.target.checked)}
                                />
                            </Form.Group>
                        </>
                    )}
                    {editType === 'interview' && (
                        <Form.Group controlId="interviewDate">
                            <Form.Label>Interview Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={interviewDate || ''}
                                onChange={(e) => setInterviewDate(e.target.value)}
                            />
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveClick}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DateModal;
