import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

interface ISelfProps {
    element: JSX.Element;
}

function ProtectedRouteElement(props: ISelfProps): JSX.Element {
    const { user } = useContext(UserContext);

    return user ? props.element : <Navigate  to='/' />;
}

export default ProtectedRouteElement;