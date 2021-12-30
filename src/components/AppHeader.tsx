import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Auth } from '@aws-amplify/auth';
import { Link } from 'react-router-dom';

function HomePage() {
    const fetch = useCallback(() => {
        console.log('fetch');
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
