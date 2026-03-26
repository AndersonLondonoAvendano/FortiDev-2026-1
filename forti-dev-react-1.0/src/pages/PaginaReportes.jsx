/**
 * PaginaReportes.jsx
 * Página de gestión y generación de reportes (reportes.html).
 *
 * Secciones:
 *  - Panel de generación rápida con formulario controlado
 *  - Historial de reportes con opción de eliminar
 */

import { useState } from "react";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import { REPORTES_MOCK } from "../data/reportes.js";

const ESTADO_INICIAL_FORM = {
  proyecto: "",
  tipo: "",
  periodo: "30",
  formato: "pdf",
  graficos: true,
  recomendaciones: true,
  soloCriticos: false,
};

export default function PaginaReportes() {
  const [form, setForm]       = useState(ESTADO_INICIAL_FORM);
  const [reportes, setReportes] = useState(REPORTES_MOCK);

  const eliminarReporte = (id) => {
    if (window.confirm("¿Eliminar este reporte?")) {
      setReportes((r) => r.filter((rep) => rep.id !== id));
    }
  };

  const handleGenerar = (e) => {
    e.preventDefault();
    if (!form.proyecto || !form.tipo) {
      alert("Por favor selecciona el proyecto y tipo de reporte.");
      return;
    }
    // TODO: fetch POST /api/reportes/generar
    alert("Generando reporte... (simulación)");
  };

  return (
    <LayoutApp
      pagina="reportes"
      tituloBarra="Reportes"
      placeholderBusqueda="Buscar reportes..."
    >
      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Gestión de reportes</h2>
          <p className="encabezado-pagina__descripcion">
            Genera, exporta y gestiona informes de seguridad para tus proyectos
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario">+ Generar reporte</button>
        </div>
      </div>

      {/* ── PANEL GENERACIÓN RÁPIDA ── */}
      <section className="panel-generacion" aria-labelledby="titulo-generacion">
        <h3 className="titulo-tarjeta" id="titulo-generacion" style={{ marginBottom: "16px" }}>
          Generación rápida de reporte
        </h3>

        <div className="formulario-generacion__campos">
          {/* Proyecto */}
          <div className="campo-grupo">
            <label className="campo-etiqueta">Proyecto</label>
            <select
              className="campo-input campo-select"
              value={form.proyecto}
              onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
            >
              <option value="">Seleccionar proyecto</option>
              <option value="todos">Todos los proyectos</option>
              <option value="alpha">Proyecto Alpha</option>
              <option value="beta">Proyecto Beta</option>
              <option value="gamma">Proyecto Gamma</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="campo-grupo">
            <label className="campo-etiqueta">Tipo de reporte</label>
            <select
              className="campo-input campo-select"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="">Seleccionar tipo</option>
              <option value="ejecutivo">Resumen ejecutivo</option>
              <option value="tecnico">Técnico detallado</option>
              <option value="remediacion">Estado de remediación</option>
              <option value="comparativo">Comparativo histórico</option>
            </select>
          </div>

          {/* Período */}
          <div className="campo-grupo">
            <label className="campo-etiqueta">Período</label>
            <select
              className="campo-input campo-select"
              value={form.periodo}
              onChange={(e) => setForm({ ...form, periodo: e.target.value })}
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Último trimestre</option>
              <option value="365">Último año</option>
            </select>
          </div>

          {/* Formato */}
          <div className="campo-grupo">
            <label className="campo-etiqueta">Formato de salida</label>
            <select
              className="campo-input campo-select"
              value={form.formato}
              onChange={(e) => setForm({ ...form, formato: e.target.value })}
            >
              <option value="pdf">PDF</option>
              <option value="html">HTML</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        {/* Opciones */}
        <div className="formulario-generacion__opciones">
          {[
            { key: "graficos",        label: "Incluir gráficos y métricas visuales" },
            { key: "recomendaciones", label: "Incluir recomendaciones de remediación" },
            { key: "soloCriticos",    label: "Solo hallazgos críticos y altos" },
          ].map(({ key, label }) => (
            <label key={key} className="checkbox-personalizado">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              <span className="checkbox-personalizado__indicador"></span>
              <span className="checkbox-personalizado__etiqueta">{label}</span>
            </label>
          ))}
        </div>

        <div className="formulario-generacion__pie">
          <span className="formulario-generacion__nota">
            Los reportes quedan disponibles en el historial por 90 días
          </span>
          <button className="btn btn--primario" onClick={handleGenerar}>
            Generar reporte
          </button>
        </div>
      </section>

      {/* ── HISTORIAL ── */}
      <section className="seccion-historial" aria-labelledby="titulo-historial">
        <div className="seccion-historial__encabezado">
          <h3 className="titulo-tarjeta" id="titulo-historial">
            Historial de reportes
          </h3>
          <button className="btn btn--secundario btn--sm">
            <i className="bi bi-arrow-clockwise"></i> Actualizar
          </button>
        </div>

        <div className="lista-reportes">
          {reportes.map((rep) => (
            <article className="tarjeta-reporte" key={rep.id}>
              <div className="tarjeta-reporte__icono">
                <i className={`bi ${rep.icono}`}></i>
              </div>

              <div className="tarjeta-reporte__info">
                <h4 className="tarjeta-reporte__nombre">{rep.nombre}</h4>
                <div className="tarjeta-reporte__meta">
                  <span className="reporte-meta-item">
                    <span className="reporte-meta-item__icono">
                      <i className="bi bi-folder2"></i>
                    </span>
                    {rep.proyecto}
                  </span>
                  <span className="reporte-meta-item">
                    <span className="reporte-meta-item__icono">
                      <i className="bi bi-calendar3"></i>
                    </span>
                    {rep.fecha}
                  </span>
                  <span className="reporte-meta-item">
                    <span className="reporte-meta-item__icono">
                      <i className="bi bi-person"></i>
                    </span>
                    {rep.autor}
                  </span>
                </div>
              </div>

              <div className="tarjeta-reporte__estado">
                <span className={`estado-badge estado-badge--${rep.estadoMod}`}>
                  {rep.estado}
                </span>
              </div>

              <div className="tarjeta-reporte__formato">
                <span className={`formato-badge formato-badge--${rep.formato}`}>
                  {rep.formato.toUpperCase()}
                </span>
              </div>

              <div className="tarjeta-reporte__acciones">
                <button
                  className="btn btn--secundario btn--sm"
                  disabled={rep.estadoMod === "en-progreso"}
                >
                  <i className="bi bi-download"></i> Descargar
                </button>
                <button
                  className="btn btn--peligro btn--sm"
                  onClick={() => eliminarReporte(rep.id)}
                  aria-label="Eliminar reporte"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </LayoutApp>
  );
}
