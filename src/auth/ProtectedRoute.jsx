// src/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children, onlyTeacher = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (onlyTeacher && user.role !== 'TEACHER') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}