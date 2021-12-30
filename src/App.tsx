
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import amplifyConfig from './amplify_config';

import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        const fetch = async () => {
            Amplify.configure(amplifyConfig)
            const user = await Auth.signIn('admin', 'adminpass');
            console.log("hey", user)
        }

        fetch();
    }, [])


    return (
        <div className="App">

        </div>
    );
}

export default App;
