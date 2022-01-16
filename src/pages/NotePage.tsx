import { useCallback, useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col, Spinner, Form, Pagination } from 'react-bootstrap';
import LambdaService from '../lambda/LambdaService';
import { INote } from '../models/Note';
import NoteCard from '../components/notes/NoteCard';
import NoteEdit from '../components/notes/NoteEdit';
import { UserContext } from '../context/UserContext';

interface INoteFilters {
    title: string;
    content: string;
    updatedAt: string;
    createdAt: string;
}
interface IPaginationData {
    active: number;
    itemsPerPage: number;
}

function NotePage() {
    const [notes, setNotes] = useState<INote[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [activePage, setActivePage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(9);
    const [filters, setFilters] = useState<INoteFilters>({
        title: '',
        content: '',
        updatedAt: '',
        createdAt: ''
    });

    const sortNotesByLastUpdated = (notes: INote[]) => {
        return notes.sort((a, b) => {
            return b.UpdatedAt - a.UpdatedAt;
        });
    };

    const fetch = useCallback(async () => {
        setLoading(true);
        LambdaService.getNotes()
            .then(res => sortNotesByLastUpdated(res))
            .then(res => {
                setNotes(res);
                setFilteredNotes(res);
            })
            .finally(() => setLoading(false));
    }, []);

    const areDatesEqual = (x: Date, y: Date) => {
        return x.getDate() === y.getDate()
            && x.getMonth() === y.getMonth()
            && x.getFullYear() === y.getFullYear();
    };

    const handleFilterChange = useCallback(async (e, field: keyof INoteFilters) => {
        const newFilters = { ...filters };
        newFilters[field] = e.target.value;
        setFilters(newFilters);

        const newFilteredNotes = notes.filter(n =>
            n.Content.includes(newFilters.content)
            && n.Title.includes(newFilters.title)
            && (!newFilters.createdAt || areDatesEqual(new Date(n.CreatedAt), new Date(newFilters.createdAt)))
            && (!newFilters.updatedAt || areDatesEqual(new Date(n.UpdatedAt), new Date(newFilters.updatedAt)))
        );

        setFilteredNotes(newFilteredNotes);
    }, [filters, notes]);

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

    const renderFilteredNotes = () => {
        if (!filteredNotes || filteredNotes.length === 0)
            return <div>Nothing to show</div>;

        const paginatedNotes = filteredNotes.slice((activePage - 1) * itemsPerPage, Math.min(((activePage - 1) * itemsPerPage) + itemsPerPage, filteredNotes.length));

        return (
            <Row xs={1} md={3} className="g-4 justify-content-start">
                {paginatedNotes.map(note => (
                    <Col>
                        <NoteCard note={note} reloadNotes={fetch} />
                    </Col>
                ))}
            </Row>
        );
    };

    const renderPagination = () => {
        const pageCount = Math.ceil(filteredNotes.length / itemsPerPage);
        const paginationItems = [];

        for (let x = 1; x <= pageCount; x++) {
            paginationItems.push(
                <Pagination.Item key={x} active={x === activePage} onClick={() => setActivePage(x)}>
                    {x}
                </Pagination.Item>
            );
        }

        return (
            <Row className="pt-4">
                <Pagination className='justify-content-center'>
                    <Pagination.First onClick={() => setActivePage(1)} />
                    <Pagination.Prev onClick={() => setActivePage(activePage - 1)} />
                    {paginationItems}
                    <Pagination.Next onClick={() => setActivePage(activePage + 1)} />
                    <Pagination.Last onClick={() => setActivePage(pageCount)} />
                </Pagination>
            </Row>
        );
    };

    return (
        <>
            <Container fluid='md' className="d-flex p-5 h-100 my-4">
                {loading ?
                    <div className='d-flex vh-100 vw-100'>
                        <Spinner animation="border" className='m-auto ' style={{ width: '4rem', height: '4rem' }} />
                    </div> :
                    <Container>
                        <Row className='justify-content-space-between align-items-end border-bottom pb-4 mb-4'>
                            <Col className='col-9'>
                                <Form className="d-flex">
                                    <Form.Group className="w-100 me-4" controlId="formTitle">
                                        <Form.Label>Note title</Form.Label>
                                        <Form.Control type="text" onChange={e => handleFilterChange(e, 'title')} />
                                    </Form.Group>
                                    <Form.Group className="w-100 me-4" controlId="formContent">
                                        <Form.Label>Note content</Form.Label>
                                        <Form.Control type="text" onChange={e => handleFilterChange(e, 'content')} />
                                    </Form.Group>
                                    <Form.Group className="w-100 me-4" controlId="formUpdatedAt">
                                        <Form.Label>Updated at</Form.Label>
                                        <Form.Control type="date" onChange={e => handleFilterChange(e, 'updatedAt')} />
                                    </Form.Group>
                                    <Form.Group className="w-100" controlId="formCreatedAt">
                                        <Form.Label>Created at</Form.Label>
                                        <Form.Control type="date" onChange={e => handleFilterChange(e, 'createdAt')} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <Button variant="dark" type="button" onClick={handleShow}>Create note</Button>
                            </Col>
                            <NoteEdit show={showNew} note={newNote} handleClose={handleClose} handleSave={handleSaveNote} />
                        </Row>
                        {renderFilteredNotes()}
                        {renderPagination()}
                    </Container>
                }
            </Container>
        </>
    );
}

export default NotePage;
