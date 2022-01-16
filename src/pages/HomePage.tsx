import { Container, Button, Row, Col, Spinner, Form, Pagination, Card } from 'react-bootstrap';
import './HomePage.css';
import notesJPG from '../assets/homepage.jpg';

function HomePage() {
    return (
        <Container fluid='md' className="d-flex p-5 h-100 my-4">
            <Card className='w-100 m-4 quote-card'>
                <Card.Body className='w-100' style={{height: '860px'}}>
                    <Container className="quote">
                        <h1 style={{fontWeight: 'bold'}}>Simple Intelligent Multilingual Pad</h1>
                        <h2 style={{fontStyle: 'italic'}}>Your all digitized notes in one place.</h2>
                        <h4 style={{fontStyle: 'italic'}} className="quote-cacao">~ Cacao DecoMorreno</h4>
                    </Container>
                    <Container className="jpg">
                        <img alt="Notes from the app" src={notesJPG} />
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default HomePage;
