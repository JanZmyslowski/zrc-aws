import { createRef, useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { INote } from '../../models/Note';
import * as Icon from 'react-bootstrap-icons';
import React from 'react';
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
    const [translatedNote, setTranslatedNote] = useState<string>('');

    const handleTranslate = async () => { 
        const translated = await LambdaService.translateNote(props.note, language);
        setTranslatedNote(translated?.TranslatedText ?? '');
    };

    const handleSave = () => {
        const noteToSave = {...props.note};
        noteToSave.Content = translatedNote;
        props.handleSave(noteToSave);
    };

    const handleCancel = () => {
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
                    Translate note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='align-items-end mb-3'>
                    <Col className='col-9'>
                        <LanguageDropdown onChange={setLanguage} />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleTranslate}>Translate</Button>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Translate result</Form.Label>
                    <Form.Control as="textarea" rows={10} onChange={(e) => setTranslatedNote(e.target.value)} value={translatedNote}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoteEdit;