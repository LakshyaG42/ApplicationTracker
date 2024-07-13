import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NotesPopup = ({ show, handleClose, saveNotes, initialNotes }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [originalNotes, setOriginalNotes] = useState(initialNotes);
    
    const handleSave = () => {
        saveNotes(notes);
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
    }, [initialNotes]);

    const modalBodyStyle = {
        height: '50vh',
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