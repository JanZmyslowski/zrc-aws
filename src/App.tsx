
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import amplifyConfig from './amplify_config';
import config from './config';

import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { useEffect } from 'react';
import Lambda from 'aws-sdk/clients/lambda'; // npm install aws-sdk


function App() {
    useEffect(() => {
        const login = async () => {
            console.log(amplifyConfig);
            Amplify.configure(amplifyConfig.Auth);
            console.log(Amplify.Auth);
            const user = await Auth.signIn('admin3', 'adminpass2');

            const lambda = new Lambda(
                {
                    region: config.region,
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                    sessionToken: config.sessionToken
                });

            lambda.invoke({
                FunctionName: 'cognitoTest',
                Payload: JSON.stringify({ user: await Auth.currentAuthenticatedUser() }),
            }, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });

            lambda.listFunctions({
                FunctionVersion: 'ALL'
            }, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });
        };

        login();
    }, []);


    return (
        <div className="App">

        </div>
    );
}

export default App;
