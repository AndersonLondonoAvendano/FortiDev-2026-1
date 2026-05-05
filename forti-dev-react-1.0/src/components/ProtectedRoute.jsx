/**
 * ProtectedRoute.jsx
 * Componente para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /login
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuth, token } = useAuth();

  // Si no hay token y no está autenticado, redirige a login
  if (!isAuth || !token) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente
  return children;
}
