import { INote } from '../../models/Note';
import { Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import NoteEdit from './NoteEdit';
import { useState } from 'react';
import LambdaService from '../../lambda/LambdaService';
import './NoteCard.css';
import NoteTranslate from './NoteTranslate';
import NoteDelete from './NoteDelete';

interface ISelfProps {
    note: INote
    reloadNotes: () => void
}

function NoteCard(props: ISelfProps) {
    const [showEdit, setShowEdit] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const handleCloseTranslate = () => setShowTranslate(false);
    const handleShowTranslate = () => setShowTranslate(true);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const note = props.note;

    const handleSaveNote = (noteToSave: INote) => {
        LambdaService.createOrUpdateNote(noteToSave).then(() => {
            handleCloseEdit();
            props.reloadNotes();
        });
    };

    const handleDeleteNote = (noteToDelete: INote) => {
        LambdaService.deleteNote(noteToDelete).then(() => {
            handleCloseDelete();
            props.reloadNotes();
        });
    };

    return (
        <>
            <Card className="h-100">
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                        <div style={{ width: '80%' }}>
                            {note.Title}
                        </div>
                        <div>
                            <Icon.Translate size={18} onClick={handleShowTranslate} style={{ cursor: 'pointer', marginRight: '8px' }} />
                            <Icon.PencilSquare size={18} onClick={handleShowEdit} style={{ cursor: 'pointer', marginRight: '8px' }} />
                            <Icon.Trash size={18} onClick={handleShowDelete} style={{ cursor: 'pointer' }} />
                        </div>
                    </Card.Title>
                    <Card.Text className='note-text'>{note.Content}</Card.Text>
                </Card.Body>

                <Card.Footer className='d-flex'>
                    <small className="text-muted">Last updated {Math.ceil(Math.abs(Date.now() - note.UpdatedAt) / (1000 * 60 * 60 * 24))} days ago</small>
                </Card.Footer>
            </Card>
            <NoteEdit show={showEdit} note={note} handleClose={handleCloseEdit} handleSave={handleSaveNote} />
            <NoteDelete show={showDelete} note={note} handleClose={handleCloseDelete} handleDelete={handleDeleteNote} />
            <NoteTranslate show={showTranslate} note={note} handleClose={handleCloseTranslate} handleSave={handleSaveNote} />
        </>
    );
}

export default NoteCard;