import { useCallback, useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap';
import LambdaService from '../lambda/LambdaService';
import { INote } from '../models/Note';
import * as Icon from 'react-bootstrap-icons';
import NoteCard from '../components/NoteCard';
import NoteEdit from '../components/NoteEdit';
import { UserContext } from '../context/UserContext';


function NotePage() {
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(false);

    const [showNew, setShowNew] = useState(false);

    const fetch = useCallback(async () => {
        setLoading(true);
        LambdaService.getNotes().then(res => {
            setNotes(res);
        }).finally(() => setLoading(false));
    }, []);

    const handleClose = () => setShowNew(false);
    const handleShow = () => setShowNew(true);

    useEffect(() => {
        fetch();
    }, []);

    const user = useContext(UserContext);

    const newNote: INote = {
        User: user.user?.username,
        Content: 'Note content',
        CreatedAt: Date.now(),
        Title: 'Note Title',
        UpdatedAt: Date.now()

    };

    const handleSaveNote = (noteToSave: INote) => {
        LambdaService.createOrUpdateNote(noteToSave).then(() => {
            handleClose();
            fetch();
        });
    };

    return (
        <>
            <Container fluid='md' className="d-flex p-5 h-100 my-4">
                {loading ?
                    <div className='d-flex vh-100 vw-100'>
                        <Spinner animation="border" className='m-auto ' style={{ width: '4rem', height: '4rem' }} />
                    </div> :
                    <Container>
                        <Row>
                            <Button variant="dark" type="button" size='lg' onClick={handleShow}>Create note</Button>
                            <NoteEdit show={showNew} note={newNote} handleClose={handleClose} handleSave={handleSaveNote} />
                        </Row>
                        <Row xs={1} md={3} className="g-4">
                            {notes.map(note => (
                                <Col>
                                    <NoteCard note={note} reloadNotes={fetch} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                }
            </Container>
        </>
    );
}

export default NotePage;
