// src/components/layout/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  // Kalau belum login, tendang ke login 
  if (!user) return <Navigate to="/login" replace />;

  // Kalau rolenya gak sesuai, tendang ke halaman 403 atau dashboard 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};