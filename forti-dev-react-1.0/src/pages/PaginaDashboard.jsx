/**
 * PaginaDashboard.jsx
 * Panel de control principal (dashboard.html).
 * Reemplaza: DashboardLeerNombre.js (el nombre viene del contexto useAuth)
 *
 * Secciones:
 *  - KPIs de severidad (4 tarjetas)
 *  - Gráfico de dona (placeholder CSS) + Actividad reciente
 *  - Tabla de hallazgos recientes
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import TablaHallazgos from "../components/shared/TablaHallazgos.jsx";
import Paginacion from "../components/shared/Paginacion.jsx";
import { HALLAZGOS_MOCK } from "../data/hallazgos.js";

const KPIS = [
  { mod: "critico", label: "Crítico", valor: 12, variacion: "subida", varTexto: "3 nuevas",    barra: 80 },
  { mod: "alto",    label: "Alto",    valor: 34, variacion: "bajada", varTexto: "5 resueltas", barra: 60 },
  { mod: "medio",   label: "Medio",   valor: 67, variacion: "subida", varTexto: "8 nuevas",    barra: 45 },
  { mod: "bajo",    label: "Bajo",    valor: 91, variacion: "neutro", varTexto: "Sin cambios", barra: 30 },
];

const ICONO_VAR = {
  subida: "bi-arrow-up-short",
  bajada: "bi-arrow-down-short",
  neutro: "bi-dash",
};

const ACTIVIDAD = [
  { tipo: "critico",  icono: "bi-exclamation-circle-fill", texto: <><strong>SQL Injection</strong> reportado en <em>Proyecto Alpha</em></>,           tiempo: "Hace 12 min",  badge: <span className="etiqueta-severidad etiqueta-severidad--critico">CRÍTICO</span> },
  { tipo: "resuelto", icono: "bi-check-circle-fill",        texto: <><strong>CSRF Token</strong> marcado como resuelto por <em>E. Díaz</em></>,         tiempo: "Hace 1 hora",  badge: <span className="etiqueta-severidad etiqueta-severidad--bajo">BAJO</span> },
  { tipo: "alto",     icono: "bi-arrow-up-circle-fill",     texto: <><strong>XSS Reflejado</strong> escalado a prioridad alta</>,                       tiempo: "Hace 3 horas", badge: <span className="etiqueta-severidad etiqueta-severidad--alto">ALTO</span> },
  { tipo: "info",     icono: "bi-shield-check",             texto: <>Escaneo automático completado en <em>Proyecto Beta</em> — 23 hallazgos</>,          tiempo: "Hace 5 horas", badge: <span className="estado-badge estado-badge--verificado">Scan</span> },
  { tipo: "resuelto", icono: "bi-check-circle-fill",        texto: <>Reporte generado: <strong>Informe Q1 2025</strong></>,                             tiempo: "Hace 1 día",   badge: <span className="estado-badge estado-badge--resuelto">Reporte</span> },
];

export default function PaginaDashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <LayoutApp
      pagina="dashboard"
      tituloBarra="Dashboard"
      placeholderBusqueda="Buscar hallazgos, proyectos..."
    >
      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">
            {usuario ? `¡Bienvenido, ${usuario}!` : "Panel de control"}
          </h2>
          <p className="encabezado-pagina__descripcion">
            Resumen del estado de seguridad — actualizado hace 5 minutos
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--secundario btn--sm">
            <i className="bi bi-calendar3"></i> Últimos 30 días
          </button>
          <button
            className="btn btn--primario btn--sm"
            onClick={() => navigate("/reportes")}
          >
            + Generar reporte
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <section className="seccion-kpi" aria-labelledby="kpi-titulo">
        <h3 className="sr-only" id="kpi-titulo">
          Indicadores de vulnerabilidades por severidad
        </h3>
        <div className="kpi-grid">
          {KPIS.map(({ mod, label, valor, variacion, varTexto, barra }) => (
            <article key={mod} className={`tarjeta-kpi tarjeta-kpi--${mod}`}>
              <div className="tarjeta-kpi__encabezado">
                <span className="tarjeta-kpi__icono">
                  <i className="bi bi-circle-fill"></i>
                </span>
                <span className="tarjeta-kpi__etiqueta">{label}</span>
              </div>
              <div className="tarjeta-kpi__valor">{valor}</div>
              <div className="tarjeta-kpi__pie">
                <span className={`tarjeta-kpi__variacion tarjeta-kpi__variacion--${variacion}`}>
                  <i className={`bi ${ICONO_VAR[variacion]}`}></i> {varTexto}
                </span>
                <span className="tarjeta-kpi__periodo">vs semana anterior</span>
              </div>
              <div className="tarjeta-kpi__barra-progreso">
                <div
                  className="tarjeta-kpi__barra-relleno"
                  style={{ width: `${barra}%` }}
                ></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── MÉTRICAS SECUNDARIAS ── */}
      <div className="fila-metricas-secundarias">

        {/* Dona de estado */}
        <div className="tarjeta tarjeta-grafico-estado">
          <div className="tarjeta-grafico-estado__encabezado">
            <h3 className="titulo-tarjeta">Estado de vulnerabilidades</h3>
          </div>
          <div className="grafico-dona-placeholder" aria-hidden="true">
            <div className="dona__anillo">
              <div className="dona__texto-centro">
                <span className="dona__num">204</span>
                <span className="dona__lbl">Total</span>
              </div>
            </div>
          </div>
          <div className="leyenda-estado">
            {[
              { color: "var(--color-critico)", texto: "Abiertos",    valor: 89 },
              { color: "var(--color-medio)",   texto: "En progreso", valor: 47 },
              { color: "var(--color-bajo)",    texto: "Resueltos",   valor: 68 },
            ].map(({ color, texto, valor }) => (
              <div className="leyenda-item" key={texto}>
                <span className="leyenda-item__punto" style={{ background: color }}></span>
                <span className="leyenda-item__texto">{texto}</span>
                <span className="leyenda-item__valor">{valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="tarjeta tarjeta-actividad">
          <div className="tarjeta-actividad__encabezado">
            <h3 className="titulo-tarjeta">Actividad reciente</h3>
            <button
              className="btn-reset enlace-ver-todos"
              onClick={() => navigate("/hallazgos")}
            >
              Ver todos
            </button>
          </div>
          <ul className="lista-actividad">
            {ACTIVIDAD.map(({ tipo, icono, texto, tiempo, badge }, i) => (
              <li key={i} className="actividad-item">
                <div className={`actividad-item__icono-wrapper actividad-item__icono-wrapper--${tipo}`}>
                  <i className={`bi ${icono}`}></i>
                </div>
                <div className="actividad-item__contenido">
                  <p className="actividad-item__texto">{texto}</p>
                  <span className="actividad-item__tiempo">{tiempo}</span>
                </div>
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── TABLA HALLAZGOS RECIENTES ── */}
      <section className="seccion-tabla-hallazgos">
        <div className="seccion-tabla-hallazgos__encabezado">
          <div>
            <h3 className="titulo-tarjeta">Hallazgos recientes</h3>
            <p className="subtitulo-tarjeta">Vulnerabilidades críticas y altas activas</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn--secundario btn--sm">
              <i className="bi bi-funnel"></i> Filtros
            </button>
            <button
              className="btn btn--primario btn--sm"
              onClick={() => navigate("/hallazgos")}
            >
              Ver todos los hallazgos
            </button>
          </div>
        </div>

        <TablaHallazgos hallazgos={HALLAZGOS_MOCK.slice(0, 6)} modoCompacto={true} />
        <Paginacion total={146} mostrando={6} />
      </section>
    </LayoutApp>
  );
}
