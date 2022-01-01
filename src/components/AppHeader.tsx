import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Auth } from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import config from '../config';
import { Lambda } from 'aws-sdk';
import { INote } from '../models/Note';
import LambdaService from '../lambda/LambdaService';

function HomePage() {
    const lambdaService = new LambdaService();

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

    const signIn = useCallback(async () => {
        const user = await Auth.signIn('admin3', 'adminpass2');
        console.log(user);
    }, []);

    const signOut = useCallback(() => {
        Auth.signOut().then(() => console.log('Logged out'));
    }, []);

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/note">Note</Link>
                    </li>
                </ul>
            </nav>
            <Button onClick={fetch}>Fetch</Button>
            <Button onClick={signIn}>Sign In</Button>
            <Button onClick={signOut}>Sign Out</Button>
        </>
    );
}

export default HomePage;
