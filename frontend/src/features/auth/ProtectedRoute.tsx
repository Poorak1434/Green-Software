import { Navigate, Outlet } from 'react-router-dom';

/**
 * A wrapper component that checks for a valid JWT in local storage 
 * before rendering child routes.
 */
export const ProtectedRoute = () => {
    // In a real app, this would use a robust auth context/hook.
    // For the MVP, we check localStorage directly.
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
