/**
 * AdminRoute.jsx
 * Componente para proteger rutas que requieren rol de administrador.
 * Si el usuario no está autenticado o no tiene rol admin, redirige a /login
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { isAuth, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "var(--color-fondo)",
        color: "var(--color-texto-tenue)", fontFamily: "var(--fuente-mono)",
        fontSize: "0.85rem", gap: "10px",
      }}>
        <span style={{ opacity: 0.5 }}>●</span> Verificando sesión…
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
}
