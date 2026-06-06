import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleHomePath } from '../utils/authHelpers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Session...</span>
          </div>
          <span className="text-secondary small fw-medium">Loading VendorBridge...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized user to their role's specific home page
    const homePath = getRoleHomePath(user.role);
    console.warn(`Access Denied to role ${user.role}. Redirecting to ${homePath}`);
    return <Navigate to={homePath} replace />;
  }

  return children;
};

export default ProtectedRoute;
