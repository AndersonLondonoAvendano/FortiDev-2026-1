import { useState, useCallback } from "react";
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
  const [pagina, setPagina] = useState("inicio");

  const navegarA = useCallback((destino) => {
    setPagina(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderPagina = () => {
    switch (pagina) {
      case "inicio":    return <PaginaInicio    onNavegar={navegarA} />;
      case "login":     return <PaginaLogin     onNavegar={navegarA} />;
      case "registro":  return <PaginaRegistro  onNavegar={navegarA} />;
      case "dashboard": return <PaginaDashboard onNavegar={navegarA} />;
      case "proyectos": return <PaginaProyectos onNavegar={navegarA} />;
      case "hallazgos": return <PaginaHallazgos onNavegar={navegarA} />;
      case "reportes":  return <PaginaReportes  onNavegar={navegarA} />;
      default:          return <PaginaInicio    onNavegar={navegarA} />;
    }
  };

  return (
    <AuthProvider>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />
      {renderPagina()}
    </AuthProvider>
  );
}
