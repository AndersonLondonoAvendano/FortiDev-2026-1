import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import TablaHallazgos from "../components/shared/TablaHallazgos.jsx";
import * as findingsApi from "../api/findings.js";
import * as projectsApi from "../api/projects.js";

const SEV_LABEL = { CRITICAL: "Crítico", HIGH: "Alto", MEDIUM: "Medio", LOW: "Bajo", INFO: "Info" };
const SEV_MOD   = { CRITICAL: "critico", HIGH: "alto", MEDIUM: "medio", LOW: "bajo", INFO: "bajo" };
const STATUS_LABEL = {
  OPEN: "Abierto", IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto", ACCEPTED_RISK: "Riesgo aceptado", FALSE_POSITIVE: "Falso positivo",
};
const SCAN_TYPE_ICON = { SAST: "bi-shield-check", MANUAL_REVIEW: "bi-pencil-square" };

function adaptFinding(f, projects) {
  const proj = projects.find((p) => p.id === f.scan?.projectId);
  return {
    id: f.id.slice(0, 8).toUpperCase(),
    tipo: f.title,
    severidad: SEV_LABEL[f.severity] ?? f.severity,
    score: null,
    proyecto: proj?.name ?? "—",
    estado: STATUS_LABEL[f.status] ?? f.status,
    fecha: new Date(f.createdAt).toLocaleDateString("es-CO"),
    asignado: f.assignedUser?.name?.slice(0, 2).toUpperCase() ?? "—",
    ultimoReporte: new Date(f.updatedAt ?? f.createdAt).toLocaleDateString("es-CO"),
  };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Hace un momento";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} días`;
}

export default function PaginaDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [findings,  setFindings]  = useState([]);
  const [projects,  setProjects]  = useState([]);
  const [scans,     setScans]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [findingList, projectList] = await Promise.all([
        findingsApi.listFindings(),
        projectsApi.listProjects(),
      ]);
      setFindings(findingList);
      setProjects(projectList);

      // Fetch scans from all projects for the activity feed
      const scanArrays = await Promise.all(
        projectList.map((p) =>
          projectsApi.listProjectScans(p.id)
            .then((s) => s.map((sc) => ({ ...sc, projectName: p.name })))
            .catch(() => [])
        )
      );
      const allScans = scanArrays.flat().sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setScans(allScans);
    } catch { /* silently handled — zeros show */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── KPI counts derived from real findings ──
  const kpiData = [
    { mod: "critico", label: "Crítico", valor: findings.filter((f) => f.severity === "CRITICAL").length },
    { mod: "alto",    label: "Alto",    valor: findings.filter((f) => f.severity === "HIGH").length },
    { mod: "medio",   label: "Medio",   valor: findings.filter((f) => f.severity === "MEDIUM").length },
    { mod: "bajo",    label: "Bajo",    valor: findings.filter((f) => f.severity === "LOW" || f.severity === "INFO").length },
  ];

  // ── Status donut counts ──
  const totalFindings = findings.length;
  const openCount     = findings.filter((f) => f.status === "OPEN").length;
  const inProgCount   = findings.filter((f) => f.status === "IN_PROGRESS").length;
  const resolvedCount = findings.filter((f) => f.status === "RESOLVED" || f.status === "ACCEPTED_RISK" || f.status === "FALSE_POSITIVE").length;

  // ── Bar width relative to max KPI ──
  const maxKpi = Math.max(...kpiData.map((k) => k.valor), 1);

  // ── Activity feed from real scans (last 5) + critical findings (last 3) ──
  const recentActivity = [
    ...scans.slice(0, 5).map((sc) => ({
      tipo: sc.status === "FAILED" ? "critico" : sc.status === "COMPLETED" ? "resuelto" : "info",
      icono: SCAN_TYPE_ICON[sc.type] ?? "bi-shield-check",
      texto: sc.status === "COMPLETED"
        ? `Escaneo completado en ${sc.projectName} — ${sc.summary?.total ?? 0} hallazgos`
        : sc.status === "FAILED"
        ? `Escaneo fallido en ${sc.projectName}`
        : `Escaneo en progreso en ${sc.projectName}`,
      tiempo: timeAgo(sc.createdAt),
      badge: sc.summary?.critical > 0
        ? <span className="etiqueta-severidad etiqueta-severidad--critico">CRÍTICO</span>
        : <span className="estado-badge estado-badge--verificado">Scan</span>,
    })),
    ...findings
      .filter((f) => f.severity === "CRITICAL" && f.status === "OPEN")
      .slice(0, 3)
      .map((f) => ({
        tipo: "critico",
        icono: "bi-exclamation-circle-fill",
        texto: f.title,
        tiempo: timeAgo(f.createdAt),
        badge: <span className="etiqueta-severidad etiqueta-severidad--critico">CRÍTICO</span>,
      })),
  ]
    .sort((a, b) => 0)  // preserve insertion order: scans first, then critical findings
    .slice(0, 6);

  // ── Recent findings for table (latest 6, critical/high first) ──
  const recentFindings = [...findings]
    .sort((a, b) => {
      const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
      return order.indexOf(a.severity) - order.indexOf(b.severity) ||
             new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 6)
    .map((f) => adaptFinding(f, projects));

  return (
    <LayoutApp pagina="dashboard" tituloBarra="Dashboard" placeholderBusqueda="Buscar hallazgos, proyectos...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">
            {user ? `¡Bienvenido, ${user.name}!` : "Panel de control"}
          </h2>
          <p className="encabezado-pagina__descripcion">
            {loading
              ? "Cargando datos..."
              : `${projects.length} proyectos · ${totalFindings} hallazgos · ${scans.length} escaneos`}
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario btn--sm" onClick={() => navigate("/proyectos")}>
            + Nuevo escaneo
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <section className="seccion-kpi" aria-labelledby="kpi-titulo">
        <h3 className="sr-only" id="kpi-titulo">Indicadores de vulnerabilidades por severidad</h3>
        <div className="kpi-grid">
          {kpiData.map(({ mod, label, valor }) => (
            <article key={mod} className={`tarjeta-kpi tarjeta-kpi--${mod}`}>
              <div className="tarjeta-kpi__encabezado">
                <span className="tarjeta-kpi__icono"><i className="bi bi-circle-fill"></i></span>
                <span className="tarjeta-kpi__etiqueta">{label}</span>
              </div>
              <div className="tarjeta-kpi__valor">
                {loading ? "—" : valor}
              </div>
              <div className="tarjeta-kpi__pie">
                <span className="tarjeta-kpi__variacion tarjeta-kpi__variacion--neutro">
                  <i className="bi bi-dash"></i>{" "}
                  {loading ? "" : valor === 0 ? "Sin hallazgos" : `${valor} activo${valor !== 1 ? "s" : ""}`}
                </span>
              </div>
              <div className="tarjeta-kpi__barra-progreso">
                <div
                  className="tarjeta-kpi__barra-relleno"
                  style={{ width: loading ? "0%" : `${Math.round((valor / maxKpi) * 100)}%` }}
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
                <span className="dona__num">{loading ? "—" : totalFindings}</span>
                <span className="dona__lbl">Total</span>
              </div>
            </div>
          </div>
          <div className="leyenda-estado">
            {[
              { color: "var(--color-critico)", texto: "Abiertos",    valor: openCount },
              { color: "var(--color-medio)",   texto: "En progreso", valor: inProgCount },
              { color: "var(--color-bajo)",    texto: "Resueltos",   valor: resolvedCount },
            ].map(({ color, texto, valor }) => (
              <div className="leyenda-item" key={texto}>
                <span className="leyenda-item__punto" style={{ background: color }}></span>
                <span className="leyenda-item__texto">{texto}</span>
                <span className="leyenda-item__valor">{loading ? "—" : valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="tarjeta tarjeta-actividad">
          <div className="tarjeta-actividad__encabezado">
            <h3 className="titulo-tarjeta">Actividad reciente</h3>
            <button className="btn-reset enlace-ver-todos" onClick={() => navigate("/escaneos")}>
              Ver todos
            </button>
          </div>

          {!loading && recentActivity.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--color-texto-tenue)", fontSize: "0.9rem" }}>
              <i className="bi bi-inbox" style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}></i>
              Sin actividad reciente. Inicia tu primer escaneo desde{" "}
              <button className="btn-reset enlace-interno" onClick={() => navigate("/proyectos")}>Proyectos</button>.
            </div>
          ) : (
            <ul className="lista-actividad">
              {recentActivity.map(({ tipo, icono, texto, tiempo, badge }, i) => (
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
          )}
        </div>
      </div>

      {/* ── TABLA HALLAZGOS RECIENTES ── */}
      <section className="seccion-tabla-hallazgos">
        <div className="seccion-tabla-hallazgos__encabezado">
          <div>
            <h3 className="titulo-tarjeta">Hallazgos recientes</h3>
            <p className="subtitulo-tarjeta">Los más críticos y recientes de todos los proyectos</p>
          </div>
          <button className="btn btn--primario btn--sm" onClick={() => navigate("/hallazgos")}>
            Ver todos los hallazgos
          </button>
        </div>

        {loading && (
          <p style={{ padding: "32px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
            Cargando hallazgos...
          </p>
        )}

        {!loading && recentFindings.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
            <i className="bi bi-shield-check" style={{ fontSize: "2.5rem", display: "block", marginBottom: "10px" }}></i>
            <p style={{ marginBottom: "4px" }}>No hay hallazgos aún.</p>
            <p style={{ fontSize: "0.85rem" }}>
              Registra un proyecto y ejecuta un escaneo desde{" "}
              <button className="btn-reset enlace-interno" onClick={() => navigate("/proyectos")}>Proyectos</button>.
            </p>
          </div>
        )}

        {!loading && recentFindings.length > 0 && (
          <TablaHallazgos hallazgos={recentFindings} modoCompacto={true} />
        )}
      </section>
    </LayoutApp>
  );
}
