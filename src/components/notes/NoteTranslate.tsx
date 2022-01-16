import { createRef, useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { INote } from '../../models/Note';
import LanguageDropdown from '../translate/LanguageDropdown';
import LambdaService from '../../lambda/LambdaService';

interface ISelfProps {
    note: INote,
    show: boolean,
    handleClose: () => void
    handleSave: (note: INote) => void
}

function NoteEdit(props: ISelfProps) {
    const [language, setLanguage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [translatedNote, setTranslatedNote] = useState<string>(props.note.Content);

    const handleTranslate = async () => {
        setLoading(true);
        const translated = await LambdaService.translateNote(props.note, language);
        setLoading(false);
        setTranslatedNote(translated?.TranslatedText ?? '');
    };

    const handleSave = () => {
        const noteToSave = { ...props.note };
        noteToSave.Content = translatedNote;
        props.handleSave(noteToSave);
    };

    const handleCancel = () => {
        props.handleClose();
    };

    useEffect(() => {
        setTranslatedNote(props.note.Content);
        setLanguage('');
        setLoading(false);
    }, [props.show]);

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
                    Translate note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='align-items-end mb-3'>
                    <Col className='col-9'>
                        <LanguageDropdown onChange={setLanguage} />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {loading ? <Spinner animation="border" style={{ margin: 'auto' }} /> : <Button variant="primary" onClick={handleTranslate} disabled={language === ''}>Translate</Button>}
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Translate result</Form.Label>
                    <Form.Control as="textarea" rows={10} onChange={(e) => setTranslatedNote(e.target.value)} value={translatedNote} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Overwrite</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoteEdit;