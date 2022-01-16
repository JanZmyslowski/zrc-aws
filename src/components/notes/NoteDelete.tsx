import { createRef, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { INote } from '../../models/Note';
import * as Icon from 'react-bootstrap-icons';
import React from 'react';

interface ISelfProps {
    note: INote,
    show: boolean,
    handleClose: () => void
    handleDelete: (note: INote) => void
}

function NoteDelete(props: ISelfProps) {

    const [note, setNote] = useState(props.note);

    const handleCancel = () => {
        setNote(props.note);
        props.handleClose();
    };
    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="d-flex justify-content-between w-90">
                    Delete note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the note?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={() => props.handleDelete(note)}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoteDelete;