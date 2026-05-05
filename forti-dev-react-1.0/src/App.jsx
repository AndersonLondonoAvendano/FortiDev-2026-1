import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PaginaInicio from "./pages/PaginaInicio.jsx";
import PaginaLogin from "./pages/PaginaLogin.jsx";
import PaginaRegistro from "./pages/PaginaRegistro.jsx";
import PaginaDashboard from "./pages/PaginaDashboard.jsx";
import PaginaProyectos from "./pages/PaginaProyectos.jsx";
import PaginaHallazgos from "./pages/PaginaHallazgos.jsx";
import PaginaEscaneos from "./pages/PaginaEscaneos.jsx";
import PaginaGestionUsuarios from "./pages/PaginaGestionUsuarios.jsx";
import estilos from "./styles/estilos.js";
import Users from "../src/components/shared/Users.jsx";

export default function App() {
  return (
    <AuthProvider>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />

        {/* Rutas protegidas - Requieren autenticación */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PaginaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <PaginaProyectos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hallazgos"
          element={
            <ProtectedRoute>
              <PaginaHallazgos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/escaneos"
          element={
            <ProtectedRoute>
              <PaginaEscaneos />
            </ProtectedRoute>
          }
        />
        
        {/* Rutas protegidas solo para administradores */}
        <Route
          path="/gestion-usuarios"
          element={
            <AdminRoute>
              <PaginaGestionUsuarios />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        {/* Ruta de fallback */}
        <Route path="*" element={<PaginaInicio />} />
      </Routes>
    </AuthProvider>
  );
}
