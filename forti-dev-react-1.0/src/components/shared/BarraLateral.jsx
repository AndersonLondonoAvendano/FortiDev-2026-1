/**
 * BarraLateral.jsx
 * Sidebar de navegación para todas las páginas internas.
 * El click en el avatar del usuario dispara el logout (reemplaza CerrarSesion.js).
 */

import { useAuth } from "../../context/AuthContext.jsx";
import MarcaLogo from "./MarcaLogo.jsx";

const NAV_ITEMS = [
  {
    seccion: "General",
    items: [
      { id: "dashboard", icono: "bi-grid-1x2",     label: "Dashboard" },
      { id: "proyectos", icono: "bi-folder2",       label: "Proyectos" },
    ],
  },
  {
    seccion: "Seguridad",
    items: [
      { id: "hallazgos",    icono: "bi-bug",            label: "Hallazgos", badge: "12" },
      { id: "escaneos",     icono: "bi-radar",          label: "Escaneos" },
      { id: "reportes",     icono: "bi-bar-chart-line", label: "Reportes" },
    ],
  },
  {
    seccion: "Sistema",
    items: [
      { id: "capacitacion",  icono: "bi-mortarboard", label: "Capacitación" },
      { id: "configuracion", icono: "bi-gear",         label: "Configuración" },
    ],
  },
];

export default function BarraLateral({ paginaActiva, onNavegar }) {
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
        onClick={() => onNavegar("dashboard")}
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
            {items.map(({ id, icono, label, badge }) => (
              <button
                key={id}
                className={`nav-item btn-reset${
                  paginaActiva === id ? " nav-item--activo" : ""
                }`}
                onClick={() => onNavegar(id)}
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
