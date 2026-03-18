/**
 * BarraSuperior.jsx
 * Topbar fija en todas las páginas internas.
 * Muestra breadcrumb, búsqueda global y botones de acción.
 */

export default function BarraSuperior({ titulo, placeholder }) {
  return (
    <header className="barra-superior" role="banner">
      {/* Breadcrumb + título */}
      <div className="barra-superior__titulo-pagina">
        <nav
          className="titulo-pagina__breadcrumb"
          aria-label="Ruta de navegación"
        >
          <span>TecnoApp SAS</span>
          <span className="separador">›</span>
        </nav>
        <h1 className="titulo-pagina__actual">{titulo}</h1>
      </div>

      {/* Búsqueda global */}
      <div className="barra-superior__busqueda" role="search">
        <span className="busqueda__icono" aria-hidden="true">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="search"
          className="busqueda__input"
          placeholder={placeholder || "Buscar..."}
          aria-label="Búsqueda global"
        />
        <kbd className="busqueda__atajo">⌘K</kbd>
      </div>

      {/* Acciones */}
      <div className="barra-superior__acciones">
        <button className="btn-topbar" aria-label="Notificaciones">
          <i className="bi bi-bell"></i>
          <span className="btn-topbar__punto-notificacion" aria-hidden="true"></span>
        </button>
        <button className="btn-topbar" aria-label="Ayuda">
          <i className="bi bi-question-circle"></i>
        </button>
      </div>
    </header>
  );
}
