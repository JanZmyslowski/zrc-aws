import { useCallback, useContext, useState } from 'react';
import { Button, Container, Form, Nav, Navbar, Offcanvas, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { Auth } from '@aws-amplify/auth';
import { INote } from '../models/Note';
import LambdaService from '../lambda/LambdaService';
import { ILoginResult, UserContext } from '../context/UserContext';
import { LinkContainer } from 'react-router-bootstrap';

function HomePage() {
    const lambdaService = new LambdaService();
    const { user, login, logout } = useContext(UserContext);
    const [messagesList, setMessagesList] = useState<ILoginResult[]>([]);
    const [userPassword, setUserPassword] = useState<string>('');
    const [userLogin, setUserLogin] = useState<string>('');

    const [show, setShow] = useState(false);
    const [loging, setLoging] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetch = useCallback(async () => {
        const user = await Auth.currentAuthenticatedUser();
        console.log(user.username);

        const newNote: INote = {
            User: user.username,
            Content: 'Note content',
            CreatedAt: Date.now(),
            Title: 'Note Title',
            UpdatedAt: Date.now()

        };

        lambdaService.createOrUpdateNote(newNote).then(() => {
            lambdaService.getNotes().then(res => {
                console.log('get1', res);
                lambdaService.deleteNote(res[0]).then(() => {
                    lambdaService.getNotes().then(res2 => {
                        console.log('get2', res2);
                        lambdaService.translateNote(res2[0], 'pl').then(tr => console.log('translated', tr));
                    });
                });
            });
        });
    }, []);

    const signIn = () => {
        setLoging(true);
        login(userLogin, userPassword).then(res => {
            setMessagesList([res]);
            if (res.success)
                handleClose();
        }).finally(() => setLoging(false));
    };

    const signOut = () => {
        logout();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" fixed='top'>
                <Container>
                    <Navbar.Brand href="/">SIMP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to='/'>
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            {user &&
                                <LinkContainer to='/note'>
                                    <Nav.Link>My Notes</Nav.Link>
                                </LinkContainer>}
                            <Nav.Link>Pricing</Nav.Link>
                            <Nav.Link>About us</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        {user ? <>
                            <Navbar.Text>
                                Signed in as: {user.username}
                            </Navbar.Text>
                            <Button variant="dark" onClick={signOut}>Sign Out</Button>
                        </> :
                            <Button variant="dark" onClick={handleShow}>Sign In</Button>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Sign in</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="login" placeholder="Enter login" value={userLogin}
                                onChange={e => setUserLogin(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={userPassword}
                                onChange={e => setUserPassword(e.target.value)} />
                        </Form.Group>
                        <Stack>
                            {loging ? <Spinner animation="border" style={{ margin: 'auto' }} /> :
                                <Button variant="dark" type="button" size='lg' onClick={signIn}>
                                    Log in
                                </Button>}

                        </Stack>

                    </Form>

                </Offcanvas.Body>
            </Offcanvas>
            {messagesList.map(message => {
                return (
                    <ToastContainer className="p-3" position='bottom-end' style={{ zIndex: 1100 }} >
                        <Toast bg={message.success ? 'success' : 'danger'} onClose={() => setMessagesList([])} delay={3000} animation autohide>
                            <Toast.Header>

                                <strong className="me-auto">Login</strong>
                            </Toast.Header>
                            <Toast.Body>{message.message}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                );
            })}

        </>

    );
}

export default HomePage;
