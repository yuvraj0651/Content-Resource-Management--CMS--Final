import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoutes = ({ allowedRoles = [] }) => {

    const { isAuthenticated, authData } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    };

    if (!allowedRoles.includes(authData?.role)) {
        return <Navigate to="/unauthorized" replace state={{from : location}} />
    };

    return <Outlet />;
}

export default ProtectedRoutes