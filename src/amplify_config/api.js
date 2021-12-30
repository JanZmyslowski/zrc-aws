import { Auth } from '@aws-amplify/auth';

const apiConfig = {
    endpoints: [
        {
            name: 'API',
            endpoint: process.env.REACT_APP_API ? process.env.REACT_APP_API : '/api',
            custom_header: async () => {
                return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` };
            }
        },
        {
            name: 'NoAuth',
            endpoint: process.env.REACT_APP_API ? process.env.REACT_APP_API : '/api'
        }
    ]
};


export default apiConfig;
