// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();

  if (booting) return null; // ou um loader
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
