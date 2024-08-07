import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NotesPopup = ({ show, handleClose, saveNotes, initialNotes, initialOaDueDate, initialOaCompleted, initialInterviewDate }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [originalNotes, setOriginalNotes] = useState(initialNotes);
    const [oaDueDate, setOaDueDate] = useState(initialOaDueDate ? initialOaDueDate.substring(0, 10) : '');
    const [oaCompleted, setOaCompleted] = useState(initialOaCompleted);
    const [interviewDate, setInterviewDate] = useState(initialInterviewDate ? initialInterviewDate.substring(0, 10) : '');
    
    const handleSave = () => {
        saveNotes(notes, oaDueDate, interviewDate, oaCompleted);
        setOriginalNotes(notes);
        setIsEditing(false);
    };

    const handleCloseWithWarning = () => {
        if (notes !== originalNotes) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                handleClose();
            }
        } else {
            handleClose();
        }
    };

    useEffect(() => {
        setNotes(initialNotes);
        setOriginalNotes(initialNotes);
        setOaDueDate(initialOaDueDate ? initialOaDueDate.substring(0, 10) : '');
        setOaCompleted(initialOaCompleted);
        setInterviewDate(initialInterviewDate ? initialInterviewDate.substring(0, 10) : '');
    }, [initialNotes, initialOaDueDate, initialOaCompleted, initialInterviewDate]);

    const modalBodyStyle = {
        height: '45vh',
        overflowY: 'auto',
    };
    const textInput = {
        height: '90%',
    };

    return (
        <Modal show={show} onHide={handleCloseWithWarning}>
            <Modal.Header closeButton>
                <Modal.Title>Notes</Modal.Title>
            </Modal.Header>
            <Form style={{ padding: '10px' }}>
                <Form.Group>
                    <Form.Label>OA Due Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={oaDueDate} 
                        onChange={(e) => setOaDueDate(e.target.value)} 
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check 
                        type="checkbox" 
                        label="OA Completed" 
                        checked={oaCompleted} 
                        onChange={(e) => setOaCompleted(e.target.checked)} 
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Interview Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={interviewDate} 
                        onChange={(e) => setInterviewDate(e.target.value)} 
                        disabled={!isEditing}
                    />
                </Form.Group>
            </Form>
            <Modal.Body style={modalBodyStyle}>
                {isEditing ? (
                    <ReactQuill style = {textInput} theme="snow" value={notes} onChange={setNotes} />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: notes }} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseWithWarning}>
                    Close
                </Button>
                {isEditing ? (
                    <>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                        <Button variant="outline-primary" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default NotesPopup;