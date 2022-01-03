import { INote } from '../models/Note';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';


interface ISelfProps {
    note: INote
}

function NoteCard(props: ISelfProps) {

    const note = props.note;

    return (
        <Card>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                    <div style={{ width: '90%' }}>{note.Title}</div><Icon.PencilSquare size={18} />
                </Card.Title>
                <Card.Text>{note.Content}</Card.Text>
            </Card.Body>

            <Card.Footer className='d-flex'>
                <small className="text-muted">Last updated {Math.ceil(Math.abs(Date.now() - note.CreatedAt) / (1000 * 60 * 60 * 24))} days ago</small>
            </Card.Footer>
        </Card>
    );
}

export default NoteCard;