/**
 * TablaHallazgos.jsx
 * Tabla de hallazgos reutilizable usada en Dashboard y en la página de Hallazgos.
 * Props:
 *  - hallazgos    → array de hallazgos a mostrar
 *  - modoCompacto → boolean — en dashboard las columnas son algo distintas
 */

import { EtiquetaSeveridad, EstadoBadge, ScoreBadge } from "./Badges.jsx";

export default function TablaHallazgos({ hallazgos, modoCompacto = false }) {
  return (
    <div className="contenedor-tabla-scroll">
      <table className="tabla-datos" id="tabla-hallazgos">
        <thead>
          <tr>
            <th className="th-check">
              <input
                type="checkbox"
                className="checkbox-tabla"
                aria-label="Seleccionar todos"
              />
            </th>
            <th className="th-sortable">Tipo de hallazgo</th>
            <th>Severidad</th>
            {!modoCompacto && <th className="th-sortable">Score CVSS</th>}
            <th>Proyecto</th>
            <th>Estado</th>
            {modoCompacto  && <th>Score CVSS</th>}
            <th className="th-sortable">Fecha</th>
            <th>Asignado a</th>
            {!modoCompacto && <th>Último reporte</th>}
            <th className="th-acciones">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {hallazgos.map((h) => (
            <tr className="fila-hallazgo" key={h.id}>
              <td>
                <input type="checkbox" className="checkbox-tabla" />
              </td>
              <td className="celda-nombre-hallazgo">
                <span className="hallazgo-id" aria-label={`ID ${h.id}`}>
                  {h.id}
                </span>
                {h.tipo}
              </td>
              <td>
                <EtiquetaSeveridad nivel={h.severidad} />
              </td>
              {!modoCompacto && (
                <td>
                  <ScoreBadge score={h.score} severidad={h.severidad} />
                </td>
              )}
              <td className="celda-proyecto">{h.proyecto}</td>
              <td>
                <EstadoBadge estado={h.estado} />
              </td>
              {modoCompacto && (
                <td>
                  <ScoreBadge score={h.score} severidad={h.severidad} />
                </td>
              )}
              <td className="celda-fecha">{h.fecha}</td>
              <td className="celda-asignado">
                <span className="avatar-usuario-mini" title={h.asignado}>
                  {h.asignado}
                </span>
              </td>
              {!modoCompacto && (
                <td className="celda-fecha">{h.ultimoReporte}</td>
              )}
              <td className="celda-acciones">
                <div className="acciones-fila">
                  <button className="btn-accion-fila" title="Ver detalle">
                    <i className="bi bi-arrow-right-short"></i>
                  </button>
                  <button className="btn-accion-fila" title="Más opciones">
                    <i className="bi bi-three-dots"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
