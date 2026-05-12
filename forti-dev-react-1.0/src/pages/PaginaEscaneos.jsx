import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import * as projectsApi from "../api/projects.js";

const STATUS_LABELS = {
  PENDING: "Pendiente",
  RUNNING: "En progreso",
  COMPLETED: "Completado",
  FAILED: "Fallido",
};

const STATUS_MOD = {
  PENDING: "pendiente",
  RUNNING: "en-progreso",
  COMPLETED: "verificado",
  FAILED: "critico",
};

const TABS = [
  { id: "TODOS", label: "Todos" },
  { id: "COMPLETED", label: "Completados" },
  { id: "RUNNING", label: "En progreso" },
  { id: "PENDING", label: "Pendientes" },
  { id: "FAILED", label: "Fallidos" },
];

export default function PaginaEscaneos() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [scansByProject, setScansByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState("TODOS");
  const [selectedProject, setSelectedProject] = useState("");
  const pollRef = useRef(null);

  const fetchAllScans = useCallback(async () => {
    try {
      const projectList = await projectsApi.listProjects();
      setProjects(projectList);
      const results = {};
      await Promise.all(
        projectList.map(async (proj) => {
          try {
            const scans = await projectsApi.listProjectScans(proj.id);
            results[proj.id] = scans;
          } catch { results[proj.id] = []; }
        })
      );
      setScansByProject(results);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAllScans();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchAllScans]);

  // Poll every 5 seconds if any scan is PENDING or RUNNING
  useEffect(() => {
    const allScans = Object.values(scansByProject).flat();
    const hasActive = allScans.some((s) => s.status === "PENDING" || s.status === "RUNNING");
    if (hasActive && !pollRef.current) {
      pollRef.current = setInterval(fetchAllScans, 5000);
    } else if (!hasActive && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [scansByProject, fetchAllScans]);

  const allScans = Object.entries(scansByProject).flatMap(([projectId, scans]) =>
    scans.map((s) => ({ ...s, projectName: projects.find((p) => p.id === projectId)?.name || projectId }))
  );

  const filtered = allScans.filter((s) => {
    if (tabActiva !== "TODOS" && s.status !== tabActiva) return false;
    if (selectedProject && s.projectId !== selectedProject) return false;
    return true;
  });

  const conteos = {
    TODOS: allScans.length,
    COMPLETED: allScans.filter((s) => s.status === "COMPLETED").length,
    RUNNING: allScans.filter((s) => s.status === "RUNNING").length,
    PENDING: allScans.filter((s) => s.status === "PENDING").length,
    FAILED: allScans.filter((s) => s.status === "FAILED").length,
  };

  return (
    <LayoutApp pagina="escaneos" tituloBarra="Escaneos" placeholderBusqueda="Buscar escaneos...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Escaneos de seguridad</h2>
          <p className="encabezado-pagina__descripcion">
            {allScans.length} escaneos en total · Semgrep SAST
            {conteos.RUNNING > 0 && (
              <span style={{ color: "var(--color-acento)", marginLeft: "8px" }}>
                · {conteos.RUNNING} en ejecución
              </span>
            )}
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario" onClick={() => navigate("/proyectos")}>
            + Nuevo escaneo
          </button>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="barra-filtros" role="search">
        <select
          className="campo-input campo-select filtro-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Proyecto: Todos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* ── TABS ── */}
      <nav className="tabs-navegacion" aria-label="Filtros de estado">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-item btn-reset${tabActiva === id ? " tab-item--activo" : ""}`}
            onClick={() => setTabActiva(id)}
          >
            {label}
            <span className="tab-item__conteo">{conteos[id] ?? 0}</span>
          </button>
        ))}
      </nav>

      {/* ── LISTA ── */}
      <div className="seccion-tabla-hallazgos">
        {loading && <p style={{ padding: "20px", textAlign: "center" }}>Cargando escaneos...</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
            No hay escaneos para mostrar.{" "}
            <button className="btn-reset enlace-interno" onClick={() => navigate("/proyectos")}>
              Inicia uno desde la página de proyectos.
            </button>
          </div>
        )}

        {filtered.map((scan) => (
          <div
            key={scan.id}
            style={{
              background: "var(--color-superficie)",
              border: "1px solid var(--color-borde)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span className={`estado-badge estado-badge--${STATUS_MOD[scan.status]}`}>
                  {STATUS_LABELS[scan.status]}
                </span>
                <span style={{ fontWeight: 600 }}>{scan.projectName}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
                  {scan.type === "SAST" ? "Semgrep SAST" : "Revisión manual"}
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
                Iniciado: {new Date(scan.createdAt).toLocaleString()}
                {scan.completedAt && ` · Completado: ${new Date(scan.completedAt).toLocaleString()}`}
              </div>
              {scan.summary && (
                <div style={{ display: "flex", gap: "10px", marginTop: "6px", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--color-critico)" }}>● {scan.summary.critical} Crít.</span>
                  <span style={{ color: "var(--color-alto)" }}>● {scan.summary.high} Alto</span>
                  <span style={{ color: "var(--color-medio)" }}>● {scan.summary.medium} Med.</span>
                  <span style={{ color: "var(--color-bajo)" }}>● {scan.summary.low} Bajo</span>
                  <span>Total: {scan.summary.total}</span>
                </div>
              )}
              {scan.errorMessage && (
                <p style={{ color: "var(--color-critico)", fontSize: "0.8rem", marginTop: "4px" }}>
                  Error: {scan.errorMessage}
                </p>
              )}
              {(scan.status === "PENDING" || scan.status === "RUNNING") && (
                <div style={{ marginTop: "8px", height: "4px", background: "var(--color-borde)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "var(--color-acento)", width: "60%", animation: "pulse 1.5s infinite" }} />
                </div>
              )}
            </div>
            {scan.status === "COMPLETED" && (
              <button
                className="btn btn--secundario btn--sm"
                onClick={() => navigate("/hallazgos")}
              >
                Ver hallazgos
              </button>
            )}
          </div>
        ))}
      </div>
    </LayoutApp>
  );
}
