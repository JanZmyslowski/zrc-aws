import { INote } from '../models/Note';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import NoteEdit from './NoteEdit';
import { useState } from 'react';
import LambdaService from '../lambda/LambdaService';


interface ISelfProps {
    note: INote
    reloadNotes: () => void
}

function NoteCard(props: ISelfProps) {
    const [showEdit, setShowEdit] = useState(false);

    const handleClose = () => setShowEdit(false);
    const handleShow = () => setShowEdit(true);

    const note = props.note;

    const handleSaveNote = (noteToSave: INote) => {
        LambdaService.createOrUpdateNote(noteToSave).then(() => {
            handleClose();
            props.reloadNotes();
        });
    };

    return (
        <>
            <Card className="h-100">
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                        <div style={{ width: '90%' }}>{note.Title}</div><Icon.PencilSquare size={18} onClick={handleShow} style={{ cursor: 'pointer' }} />
                    </Card.Title>
                    <Card.Text style={{ textOverflow: 'clip' }}>{note.Content}</Card.Text>
                </Card.Body>

                <Card.Footer className='d-flex'>
                    <small className="text-muted">Last updated {Math.ceil(Math.abs(Date.now() - note.UpdatedAt) / (1000 * 60 * 60 * 24))} days ago</small>
                </Card.Footer>
            </Card>
            <NoteEdit show={showEdit} note={note} handleClose={handleClose} handleSave={handleSaveNote} />
        </>
    );
}

export default NoteCard;