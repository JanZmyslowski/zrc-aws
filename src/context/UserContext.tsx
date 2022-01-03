import Auth, { CognitoUser } from '@aws-amplify/auth';
import { createContext, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';

interface IUserContext {
    user: CognitoUser | any;
    login: (login: string, password: string) => Promise<ILoginResult>;
    logout: () => void;
}

export interface ILoginResult {
    success: boolean;
    message: string;
}

export const UserContext = createContext<IUserContext>({ user: null, login: () => { return new Promise(() => { return { success: false, message: 'Not initialized' }; }); }, logout: () => { } });

const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState(null);

    const checkLoggedUser = async () => {
        try {
            const loggedUser = await Auth.currentAuthenticatedUser();
            setUser(loggedUser);
        } catch {

        }
    };

    useEffect(() => {
        checkLoggedUser();
    }, []);

    const login = async (login: string, password: string): Promise<ILoginResult> => {
        try {
            const newUser = await Auth.signIn(login, password);
            setUser(newUser);
            return { success: true, message: 'Welcome ' + newUser.username };
        } catch (e) {
            return { success: false, message: 'Invalid login or password' };
        }
    };

    const logout = () => {
        Auth.signOut().then(() => {
            setUser(null);
            window.location.href = '/';
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;