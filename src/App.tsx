
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import amplifyConfig from './amplify_config';

import Amplify from '@aws-amplify/core';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotePage from './pages/NotePage';
import AppHeader from './components/AppHeader';

function App() {
    useEffect(() => {
        Amplify.configure(amplifyConfig);
    }, []);


    return (
        <BrowserRouter>
            <div>
                <AppHeader />

                {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
                <Routes>
                    <Route path="/note" element={<NotePage />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
