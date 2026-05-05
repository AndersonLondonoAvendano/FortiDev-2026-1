/**
 * BarraLateral.jsx
 * Sidebar de navegación para todas las páginas internas.
 * El click en el avatar del usuario dispara el logout (reemplaza CerrarSesion.js).
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import MarcaLogo from "./MarcaLogo.jsx";


// Función auxiliar para generar iniciales
const getInitials = (nombre) => {
  if (!nombre) return "??";
  const partes = nombre.trim().split(" ");
  if (partes.length === 1) {
    return partes[0].substring(0, 2).toUpperCase();
  }
  return (partes[0][0] + partes[1][0]).toUpperCase();
};

// Función para obtener los items de navegación según el rol
const getNavItems = (rol) => {
  const navItems = [
    {
      seccion: "General",
      items: [
        { id: "dashboard", ruta: "/dashboard", icono: "bi-grid-1x2", label: "Dashboard" },
        { id: "proyectos", ruta: "/proyectos", icono: "bi-folder2", label: "Proyectos" },
      ],
    },
    {
      seccion: "Seguridad",
      items: [
        { id: "hallazgos", ruta: "/hallazgos", icono: "bi-bug", label: "Hallazgos", badge: "12" },
        { id: "escaneos", ruta: "/escaneos", icono: "bi-radar", label: "Escaneos" },
        { id: "reportes", ruta: "/reportes", icono: "bi-bar-chart-line", label: "Reportes" },
      ],
    },
    {
      seccion: "Sistema",
      items: [
        { id: "capacitacion", ruta: "/capacitacion", icono: "bi-mortarboard", label: "Capacitación" },
        { id: "configuracion", ruta: "/configuracion", icono: "bi-gear", label: "Configuración" },
      ],
    },
  ];

  // Agregar sección de administración solo si es admin
  if (rol === "admin") {
    navItems.push({
      seccion: "Administración",
      items: [
        { id: "gestion-usuarios", ruta: "/gestion-usuarios", icono: "bi-people-fill", label: "Gestión de Usuarios" },
      ],
    });
  }

  return navItems;
};

export default function BarraLateral({ paginaActiva, onMostrarModal }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const rutasImplementadas = ['/dashboard', '/proyectos', '/hallazgos', '/escaneos', '/gestion-usuarios'];
  const NAV_ITEMS = getNavItems(user?.rol);

  const handleClick = (ruta) => {
    if (rutasImplementadas.includes(ruta)) {
      navigate(ruta);
    } else {
      onMostrarModal(true);
    }
  };

  return (
    <aside
      className="barra-lateral"
      id="barra-lateral"
      role="navigation"
      aria-label="Menú principal"
    >
      {/* Logo / Marca */}
      <button
        className="barra-lateral__marca btn-reset"
        onClick={() => navigate("/dashboard")}
      >
        <MarcaLogo />
      </button>

      {/* Selector de organización */}
      <div className="barra-lateral__selector-org">
        <div className="selector-org__avatar">TA</div>
        <div className="selector-org__info">
          <div className="selector-org__nombre">TecnoApp SAS</div>
          <div className="selector-org__tipo">Organización</div>
        </div>
        <span className="selector-org__chevron">
          <i className="bi bi-chevron-expand"></i>
        </span>
      </div>

      {/* Navegación */}
      <nav className="barra-lateral__nav">
        {NAV_ITEMS.map(({ seccion, items }) => (
          <div className="nav-seccion" key={seccion}>
            <div className="nav-seccion__etiqueta">{seccion}</div>
            {items.map(({ id, ruta, icono, label, badge }) => (
              <button
                key={id}
                className={`nav-item btn-reset${
                  paginaActiva === id ? " nav-item--activo" : ""
                }`}
                onClick={() => handleClick(ruta)}
              >
                <span className="nav-item__icono">
                  <i className={`bi ${icono}`}></i>
                </span>
                <span className="nav-item__texto">{label}</span>
                {badge && (
                  <span className="nav-item__badge">{badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Perfil de usuario — click para cerrar sesión */}
      <div className="barra-lateral__usuario">
        <div
          className="usuario-perfil"
          id="menu-usuario"
          onClick={logout}
          title="Cerrar sesión"
          style={{ cursor: "pointer" }}
        >
          <div className="usuario-perfil__avatar">
            {getInitials(user?.nombre)}
          </div>
          <div className="usuario-perfil__info">
            <div className="usuario-perfil__nombre">
              {user?.nombre || "Usuario"}
            </div>
            <div className="usuario-perfil__rol">
              {user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : "Sin rol"}
            </div>
          </div>
          <span className="usuario-perfil__opciones">
            <i className="bi bi-three-dots"></i>
          </span>
        </div>
      </div>
    </aside>
  );
}
