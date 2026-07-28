import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

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

export default ProtectedRoute;