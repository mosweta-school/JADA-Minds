// frontend/src/routes/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import  useAuth  from '../hooks/useAuth';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;

      case "specialist":
        return <Navigate to="/specialist" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}