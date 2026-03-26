import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PaginaInicio from "./pages/PaginaInicio.jsx";
import PaginaLogin from "./pages/PaginaLogin.jsx";
import PaginaRegistro from "./pages/PaginaRegistro.jsx";
import PaginaDashboard from "./pages/PaginaDashboard.jsx";
import PaginaProyectos from "./pages/PaginaProyectos.jsx";
import PaginaHallazgos from "./pages/PaginaHallazgos.jsx";
import PaginaReportes from "./pages/PaginaReportes.jsx";
import estilos from "./styles/estilos.js";

export default function App() {
  return (
    <AuthProvider>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/proyectos" element={<PaginaProyectos />} />
        <Route path="/hallazgos" element={<PaginaHallazgos />} />
        <Route path="/reportes" element={<PaginaReportes />} />
        <Route path="*" element={<PaginaInicio />} />
      </Routes>
    </AuthProvider>
  );
}
