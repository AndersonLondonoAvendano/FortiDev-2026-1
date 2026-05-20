import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OrgProvider } from "./context/OrgContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PaginaInicio from "./pages/PaginaInicio.jsx";
import PaginaLogin from "./pages/PaginaLogin.jsx";
// import PaginaRegistro from "./pages/PaginaRegistro.jsx"; // Solo accesible para admins via /gestion-usuarios
import PaginaDashboard from "./pages/PaginaDashboard.jsx";
import PaginaProyectos from "./pages/PaginaProyectos.jsx";
import PaginaHallazgos from "./pages/PaginaHallazgos.jsx";
import PaginaEscaneos from "./pages/PaginaEscaneos.jsx";
import PaginaGestionUsuarios from "./pages/PaginaGestionUsuarios.jsx";
import PaginaOrganizaciones from "./pages/PaginaOrganizaciones.jsx";
import PaginaDetalleOrganizacion from "./pages/PaginaDetalleOrganizacion.jsx";
import estilos from "./styles/estilos.js";

export default function App() {
  return (
    <AuthProvider>
      <OrgProvider>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaLogin />} />
        {/* <Route path="/registro" element={<PaginaRegistro />} /> */}

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
        
        <Route
          path="/organizaciones"
          element={
            <ProtectedRoute>
              <PaginaOrganizaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizaciones/:id"
          element={
            <ProtectedRoute>
              <PaginaDetalleOrganizacion />
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
        {/* Ruta de fallback */}
        <Route path="*" element={<PaginaInicio />} />
      </Routes>
      </OrgProvider>
    </AuthProvider>
  );
}
