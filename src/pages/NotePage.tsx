import { useCallback, useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import LambdaService from '../lambda/LambdaService';
import { INote } from '../models/Note';
import * as Icon from 'react-bootstrap-icons';
import NoteCard from '../components/NoteCard';


function NotePage() {
    const lambdaService = new LambdaService();
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        setLoading(true);
        lambdaService.getNotes().then(res => {
            setNotes(res);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch();
    }, []);

    return (
        <Container fluid='md' className="d-flex p-5 h-100 my-4" >
            {loading ?
                <div className='d-flex vh-100 vw-100'>
                    <Spinner animation="border" className='m-auto ' style={{ width: '4rem', height: '4rem' }} />
                </div> :
                < Row xs={1} md={3} className="g-4" >
                    {
                        notes.map(note => (
                            <Col>
                                <NoteCard note={note} />
                            </Col>
                        ))
                    }
                </Row >}
        </Container >
    );
}

export default NotePage;
