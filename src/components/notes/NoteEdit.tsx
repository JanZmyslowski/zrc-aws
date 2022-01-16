import { createRef, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { INote } from '../../models/Note';
import * as Icon from 'react-bootstrap-icons';
import React from 'react';

interface ISelfProps {
    note: INote,
    show: boolean,
    handleClose: () => void
    handleSave: (note: INote) => void
}

function NoteEdit(props: ISelfProps) {
    const [isEditTitle, setIsEditTitle] = useState(false);

    const titleInput = React.useRef<HTMLInputElement>(null);

    const [note, setNote] = useState(props.note);

    const editTile = () => {
        setIsEditTitle(true);
    };

    useEffect(() => {
        if (isEditTitle) {
            titleInput?.current?.focus();
        }
    }, [isEditTitle]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (titleInput.current && !titleInput.current.contains(event.target)) {
                setIsEditTitle(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [titleInput]);

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
                    <Form.Control ref={titleInput} style={{ marginRight: '6px', border: 'none' }} contentEditable={isEditTitle} onChange={e => setNote({ ...note, Title: e.target.value })}
                        value={note.Title}
                    />
                    {!isEditTitle && <Icon.Pencil size={16} onClick={editTile} />}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea className="form-control" rows={10} onChange={(e) => setNote({ ...note, Content: e.target.value })}>{note.Content}</textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={() => props.handleSave(note)}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoteEdit;