import { useState, useEffect, useCallback } from "react";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import TablaHallazgos from "../components/shared/TablaHallazgos.jsx";
import Paginacion from "../components/shared/Paginacion.jsx";
import * as findingsApi from "../api/findings.js";
import * as projectsApi from "../api/projects.js";

const SEVERITY_API = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const STATUS_API = ["OPEN", "IN_PROGRESS", "RESOLVED", "ACCEPTED_RISK", "FALSE_POSITIVE"];

const TABS = [
  { id: "TODOS", label: "Todos" },
  { id: "OPEN", label: "Abiertos" },
  { id: "IN_PROGRESS", label: "En progreso" },
  { id: "RESOLVED", label: "Resueltos" },
];

function adaptFinding(f) {
  const severityMap = { CRITICAL: "Crítico", HIGH: "Alto", MEDIUM: "Medio", LOW: "Bajo", INFO: "Info" };
  const statusMap = { OPEN: "Abierto", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto", ACCEPTED_RISK: "Riesgo aceptado", FALSE_POSITIVE: "Falso positivo" };
  return {
    ...f,
    severidad: severityMap[f.severity] || f.severity,
    estado: statusMap[f.status] || f.status,
    titulo: f.title,
    descripcion: f.description,
    proyecto: f.scan?.projectId || "—",
  };
}

export default function PaginaHallazgos() {
  const [findings, setFindings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState("TODOS");
  const [filtroSeveridad, setFiltroSeveridad] = useState("");
  const [filtroProyecto, setFiltroProyecto] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [findingList, projectList] = await Promise.all([
        findingsApi.listFindings(),
        projectsApi.listProjects(),
      ]);
      setFindings(findingList.map(adaptFinding));
      setProjects(projectList);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = findings.filter((f) => {
    if (tabActiva !== "TODOS" && f.status !== tabActiva) return false;
    if (filtroSeveridad && f.severity !== filtroSeveridad) return false;
    if (filtroProyecto && f.scan?.projectId !== filtroProyecto) return false;
    if (filtroTexto) {
      const q = filtroTexto.toLowerCase();
      if (!f.title?.toLowerCase().includes(q) && !f.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const conteos = {
    TODOS: findings.length,
    OPEN: findings.filter((f) => f.status === "OPEN").length,
    IN_PROGRESS: findings.filter((f) => f.status === "IN_PROGRESS").length,
    RESOLVED: findings.filter((f) => f.status === "RESOLVED").length,
  };

  return (
    <LayoutApp pagina="hallazgos" tituloBarra="Hallazgos" placeholderBusqueda="Buscar hallazgos...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Hallazgos de seguridad</h2>
          <p className="encabezado-pagina__descripcion">
            {findings.length} hallazgos en todos los proyectos
          </p>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="barra-filtros" role="search">
        <div className="barra-filtros__campo-busqueda">
          <span className="campo-input-icono" style={{ left: "12px", position: "absolute", color: "var(--color-texto-tenue)" }}>
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="campo-input"
            style={{ paddingLeft: "36px" }}
            placeholder="Buscar por título o descripción..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>
        <div className="barra-filtros__selectores">
          <select className="campo-input campo-select filtro-select" value={filtroSeveridad} onChange={(e) => setFiltroSeveridad(e.target.value)}>
            <option value="">Severidad: Todas</option>
            {SEVERITY_API.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="campo-input campo-select filtro-select" value={filtroProyecto} onChange={(e) => setFiltroProyecto(e.target.value)}>
            <option value="">Proyecto: Todos</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn--secundario btn--sm" onClick={() => { setFiltroSeveridad(""); setFiltroProyecto(""); setFiltroTexto(""); }}>
            <i className="bi bi-x-lg"></i> Limpiar
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <nav className="tabs-navegacion" aria-label="Filtros de estado">
        {TABS.map(({ id, label }) => (
          <button key={id} className={`tab-item btn-reset${tabActiva === id ? " tab-item--activo" : ""}`} onClick={() => setTabActiva(id)}>
            {label}<span className="tab-item__conteo">{conteos[id] ?? 0}</span>
          </button>
        ))}
      </nav>

      {/* ── TABLA ── */}
      <div className="seccion-tabla-hallazgos">
        {loading && <p style={{ padding: "20px", textAlign: "center" }}>Cargando hallazgos...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ padding: "40px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
            No hay hallazgos que coincidan con los filtros.
          </p>
        )}
        {!loading && filtered.length > 0 && (
          <>
            <TablaHallazgos
              hallazgos={filtered}
              onStatusChange={async (id, newStatus) => {
                await findingsApi.updateFindingStatus(id, newStatus);
                setFindings((prev) =>
                  prev.map((f) => f.id === id ? { ...f, status: newStatus, estado: { OPEN: "Abierto", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto", ACCEPTED_RISK: "Riesgo aceptado", FALSE_POSITIVE: "Falso positivo" }[newStatus] || newStatus } : f)
                );
              }}
            />
            <Paginacion total={findings.length} mostrando={filtered.length} />
          </>
        )}
      </div>
    </LayoutApp>
  );
}
