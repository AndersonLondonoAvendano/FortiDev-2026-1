import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrg } from "../../context/OrgContext.jsx";
import MarcaLogo from "./MarcaLogo.jsx";

const getInitials = (nombre) => {
  if (!nombre) return "??";
  const partes = nombre.trim().split(" ");
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
};

const getNavItems = (rol) => {
  const navItems = [
    {
      seccion: "General",
      items: [
        { id: "dashboard",      ruta: "/dashboard",      icono: "bi-grid-1x2",     label: "Dashboard" },
        { id: "organizaciones", ruta: "/organizaciones",  icono: "bi-building",     label: "Organizaciones" },
        { id: "proyectos",      ruta: "/proyectos",       icono: "bi-folder2",      label: "Proyectos" },
      ],
    },
    {
      seccion: "Seguridad",
      items: [
        { id: "hallazgos",  ruta: "/hallazgos",  icono: "bi-bug",            label: "Hallazgos" },
        { id: "escaneos",   ruta: "/escaneos",   icono: "bi-radar",          label: "Escaneos" },
        { id: "reportes",   ruta: "/reportes",   icono: "bi-bar-chart-line", label: "Reportes" },
      ],
    },
    {
      seccion: "Sistema",
      items: [
        { id: "capacitacion",  ruta: "/capacitacion",  icono: "bi-mortarboard", label: "Capacitación" },
        { id: "configuracion", ruta: "/configuracion", icono: "bi-gear",         label: "Configuración" },
      ],
    },
  ];

  if (rol === "ADMIN") {
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
  const { orgs, currentOrg, loadingOrgs, switchOrg } = useOrg();

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);

  const rutasImplementadas = ["/dashboard", "/organizaciones", "/proyectos", "/hallazgos", "/escaneos", "/gestion-usuarios"];
  const NAV_ITEMS = getNavItems(user?.role);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickFuera(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(false);
      }
    }
    if (dropdownAbierto) document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [dropdownAbierto]);

  const handleClick = (ruta) => {
    if (rutasImplementadas.includes(ruta)) {
      navigate(ruta);
    } else {
      onMostrarModal(true);
    }
  };

  const handleSwitchOrg = (org) => {
    switchOrg(org);
    setDropdownAbierto(false);
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
      <div className="selector-org-wrapper" ref={dropdownRef}>
        <button
          className="barra-lateral__selector-org btn-reset"
          onClick={() => setDropdownAbierto((v) => !v)}
          aria-expanded={dropdownAbierto}
          aria-haspopup="listbox"
          disabled={loadingOrgs}
        >
          <div className="selector-org__avatar">
            {loadingOrgs ? "…" : getInitials(currentOrg?.name ?? "")}
          </div>
          <div className="selector-org__info">
            <div className="selector-org__nombre">
              {loadingOrgs ? "Cargando…" : (currentOrg?.name ?? "Sin organización")}
            </div>
            <div className="selector-org__tipo">Organización</div>
          </div>
          <span className="selector-org__chevron">
            <i className={`bi ${dropdownAbierto ? "bi-chevron-up" : "bi-chevron-expand"}`}></i>
          </span>
        </button>

        {dropdownAbierto && (
          <div className="selector-org__dropdown" role="listbox">
            <div className="selector-org__dropdown-header">Cambiar organización</div>

            {orgs.length === 0 ? (
              <div className="selector-org__dropdown-empty">
                No perteneces a ninguna organización
              </div>
            ) : (
              orgs.map((org) => (
                <button
                  key={org.id}
                  className={`selector-org__dropdown-item btn-reset${currentOrg?.id === org.id ? " selector-org__dropdown-item--activo" : ""}`}
                  role="option"
                  aria-selected={currentOrg?.id === org.id}
                  onClick={() => handleSwitchOrg(org)}
                >
                  <div className="selector-org__dropdown-avatar">
                    {getInitials(org.name)}
                  </div>
                  <div className="selector-org__dropdown-info">
                    <div className="selector-org__dropdown-nombre">{org.name}</div>
                    {org._count && (
                      <div className="selector-org__dropdown-meta">
                        {org._count.projects} proyecto{org._count.projects !== 1 ? "s" : ""} · {org._count.members} miembro{org._count.members !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  {currentOrg?.id === org.id && (
                    <i className="bi bi-check2 selector-org__dropdown-check"></i>
                  )}
                </button>
              ))
            )}

            <div className="selector-org__dropdown-divider" />
            <button
              className="selector-org__dropdown-item selector-org__dropdown-item--accion btn-reset"
              onClick={() => { setDropdownAbierto(false); navigate("/organizaciones"); }}
            >
              <i className="bi bi-building-add"></i>
              <span>Gestionar organizaciones</span>
            </button>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="barra-lateral__nav">
        {NAV_ITEMS.map(({ seccion, items }) => (
          <div className="nav-seccion" key={seccion}>
            <div className="nav-seccion__etiqueta">{seccion}</div>
            {items.map(({ id, ruta, icono, label, badge }) => (
              <button
                key={id}
                className={`nav-item btn-reset${paginaActiva === id ? " nav-item--activo" : ""}`}
                onClick={() => handleClick(ruta)}
              >
                <span className="nav-item__icono">
                  <i className={`bi ${icono}`}></i>
                </span>
                <span className="nav-item__texto">{label}</span>
                {badge && <span className="nav-item__badge">{badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Perfil de usuario */}
      <div className="barra-lateral__usuario">
        <div
          className="usuario-perfil"
          id="menu-usuario"
          onClick={logout}
          title="Cerrar sesión"
          style={{ cursor: "pointer" }}
        >
          <div className="usuario-perfil__avatar">{getInitials(user?.name)}</div>
          <div className="usuario-perfil__info">
            <div className="usuario-perfil__nombre">{user?.name || "Usuario"}</div>
            <div className="usuario-perfil__rol">{user?.role ?? "Sin rol"}</div>
          </div>
          <span className="usuario-perfil__opciones">
            <i className="bi bi-three-dots"></i>
          </span>
        </div>
      </div>
    </aside>
  );
}
