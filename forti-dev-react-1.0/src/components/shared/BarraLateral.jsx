/**
 * BarraLateral.jsx
 * Sidebar de navegación para todas las páginas internas.
 * El click en el avatar del usuario dispara el logout (reemplaza CerrarSesion.js).
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import MarcaLogo from "./MarcaLogo.jsx";

const NAV_ITEMS = [
  {
    seccion: "General",
    items: [
      { id: "dashboard", ruta: "/dashboard", icono: "bi-grid-1x2",     label: "Dashboard" },
      { id: "proyectos", ruta: "/proyectos", icono: "bi-folder2",       label: "Proyectos" },
    ],
  },
  {
    seccion: "Seguridad",
    items: [
      { id: "hallazgos",    ruta: "/hallazgos", icono: "bi-bug",            label: "Hallazgos", badge: "12" },
      { id: "escaneos",     ruta: "/escaneos", icono: "bi-radar",          label: "Escaneos" },
      { id: "reportes",     ruta: "/reportes", icono: "bi-bar-chart-line", label: "Reportes" },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      { id: "capacitacion",  ruta: "/capacitacion", icono: "bi-mortarboard", label: "Capacitación" },
      { id: "configuracion", ruta: "/configuracion", icono: "bi-gear",         label: "Configuración" },
    ],
  },
];

export default function BarraLateral({ paginaActiva }) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

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
                onClick={() => navigate(ruta)}
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
        >
          <div className="usuario-perfil__avatar">AL</div>
          <div className="usuario-perfil__info">
            <div className="usuario-perfil__nombre">
              {usuario || "Anderson Londoño"}
            </div>
            <div className="usuario-perfil__rol">Administrador</div>
          </div>
          <span className="usuario-perfil__opciones">
            <i className="bi bi-three-dots"></i>
          </span>
        </div>
      </div>
    </aside>
  );
}
