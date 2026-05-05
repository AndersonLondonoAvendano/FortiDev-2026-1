/**
 * AdminRoute.jsx
 * Componente para proteger rutas que requieren rol de administrador.
 * Si el usuario no está autenticado o no tiene rol admin, redirige a /login
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { isAuth, token, user } = useAuth();

  // Si no hay token y no está autenticado, redirige a login
  if (!isAuth || !token) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es administrador, redirige a dashboard
  if (user?.rol !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado Y es administrador, renderiza el componente
  return children;
}
