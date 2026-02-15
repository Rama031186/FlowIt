import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants/roles';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    const dashboardPath = user.role === ROLES.CUSTOMER ? '/' : '/admin-portal/dashboard';
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <h1 className="display-1 fw-bold text-danger">403</h1>
          <p className="fs-4 text-muted">Access Denied</p>
          <p className="text-muted mb-4">You don't have permission to view this page.</p>
          <a href={dashboardPath} className="btn btn-primary">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return children;
}

