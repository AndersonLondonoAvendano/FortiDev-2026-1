/**
 * Paginacion.jsx
 * Pie de tabla con info de filas mostradas, botones de página y selector de filas.
 * Props:
 *  - total     → total de registros
 *  - mostrando → cuántos se muestran actualmente
 */

export default function Paginacion({ total, mostrando }) {
  return (
    <div className="tabla-pie">
      <span className="tabla-pie__info">
        Mostrando {mostrando} de {total} hallazgos
      </span>

      <div className="paginacion">
        <button className="btn-paginacion" disabled aria-label="Página anterior">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button
          className="btn-paginacion btn-paginacion--activo"
          aria-current="page"
        >
          1
        </button>
        <button className="btn-paginacion">2</button>
        <button className="btn-paginacion">3</button>
        <span className="paginacion__puntos">…</span>
        <button className="btn-paginacion">15</button>
        <button className="btn-paginacion" aria-label="Página siguiente">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <select
        className="selector-filas-pagina"
        aria-label="Filas por página"
        defaultValue="10"
      >
        <option value="10">10 filas</option>
        <option value="25">25 filas</option>
        <option value="50">50 filas</option>
      </select>
    </div>
  );
}
