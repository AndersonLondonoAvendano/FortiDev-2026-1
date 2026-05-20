import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import * as projectsApi from "../api/projects.js";
import * as orgsApi from "../api/organizations.js";
import { useOrg } from "../context/OrgContext.jsx";

const SEVERITY_LABELS = { critico: "Críticas", alto: "Altas", medio: "Medias", bajo: "Bajas" };
const GRADIENTS = [
  "linear-gradient(135deg,#6c63ff,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
];

function getInitials(name = "") {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function PaginaProyectos() {
  const navigate = useNavigate();
  const { currentOrg, orgs } = useOrg();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ repoUrl: "", name: "", description: "", branch: "main", organizationId: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [startingScan, setStartingScan] = useState(null);

  // Pre-fill organizationId when currentOrg changes
  useEffect(() => {
    if (currentOrg) setForm((f) => ({ ...f, organizationId: currentOrg.id }));
  }, [currentOrg]);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const all = await projectsApi.listProjects();
      // Filter by selected org; projects with no org show in all contexts (backward compat)
      const filtered = currentOrg
        ? all.filter((p) => !p.organizationId || p.organizationId === currentOrg.id)
        : all;
      setProjects(filtered);
    } catch {
      setError("Error al cargar los proyectos. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleCreateProject(e) {
    e.preventDefault();
    if (!form.repoUrl || !form.name) {
      setFormError("La URL del repositorio y el nombre son obligatorios.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const payload = { ...form };
      if (!payload.organizationId) delete payload.organizationId;
      await projectsApi.createProject(payload);
      setShowForm(false);
      setForm({ repoUrl: "", name: "", description: "", branch: "main", organizationId: "" });
      await fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al crear el proyecto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStartScan(projectId) {
    setStartingScan(projectId);
    try {
      await projectsApi.startScan(projectId);
      navigate("/escaneos");
    } catch (err) {
      alert(err.response?.data?.error || "Error al iniciar el escaneo.");
    } finally {
      setStartingScan(null);
    }
  }

  async function handleDeleteProject(id) {
    if (!window.confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar el proyecto.");
    }
  }

  return (
    <LayoutApp pagina="proyectos" tituloBarra="Proyectos" placeholderBusqueda="Buscar proyectos...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Gestión de proyectos</h2>
          <p className="encabezado-pagina__descripcion">
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""} activo{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario" onClick={() => setShowForm(true)}>
            + Nuevo proyecto
          </button>
        </div>
      </div>

      {/* ── STATS RÁPIDAS ── */}
      <div className="stats-proyectos">
        {[
          { num: projects.length, color: "", lbl: "Proyectos activos" },
          { num: projects.reduce((a, p) => a + (p._count?.scans || 0), 0), color: "var(--color-acento)", lbl: "Escaneos totales" },
          { num: projects.filter((p) => p.status === "ACTIVE").length, color: "var(--color-bajo)", lbl: "Proyectos activos" },
          { num: projects.filter((p) => p.status === "ARCHIVED").length, color: "var(--color-critico)", lbl: "Archivados" },
        ].map(({ num, color, lbl }) => (
          <div className="stat-proyecto-card" key={lbl}>
            <span className="stat-proyecto-card__num" style={color ? { color } : {}}>{num}</span>
            <span className="stat-proyecto-card__lbl">{lbl}</span>
          </div>
        ))}
      </div>

      {/* ── FORMULARIO NUEVO PROYECTO ── */}
      {showForm && (
        <div style={{ background: "var(--color-superficie)", border: "1px solid var(--color-borde)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>Registrar repositorio GitHub</h3>
          <form onSubmit={handleCreateProject}>
            <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
              <div className="campo-grupo" style={{ gridColumn: "1 / -1" }}>
                <label className="campo-etiqueta">URL del repositorio *</label>
                <input
                  type="url"
                  className="campo-input"
                  placeholder="https://github.com/owner/repo"
                  value={form.repoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                  required
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombre del proyecto *</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Mi Proyecto"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Rama</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="main"
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                />
              </div>
              <div className="campo-grupo" style={{ gridColumn: "1 / -1" }}>
                <label className="campo-etiqueta">Descripción</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Descripción opcional"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              {orgs.length > 0 && (
                <div className="campo-grupo" style={{ gridColumn: "1 / -1" }}>
                  <label className="campo-etiqueta">Organización (opcional)</label>
                  <select
                    className="campo-input campo-select"
                    value={form.organizationId}
                    onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
                  >
                    <option value="">Sin organización</option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {formError && (
              <p style={{ color: "var(--color-critico)", marginTop: "8px" }}>{formError}</p>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button type="submit" className="btn btn--primario" disabled={submitting}>
                {submitting ? "Creando..." : "Crear proyecto"}
              </button>
              <button type="button" className="btn btn--secundario" onClick={() => { setShowForm(false); setFormError(""); }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ESTADO ── */}
      {loading && <p style={{ padding: "20px", textAlign: "center" }}>Cargando proyectos...</p>}
      {error && <p style={{ color: "var(--color-critico)", padding: "20px", textAlign: "center" }}>{error}</p>}

      {/* ── LISTA DE PROYECTOS ── */}
      {!loading && !error && projects.length === 0 && (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
          <p>No tienes proyectos aún. Crea tu primer proyecto para comenzar.</p>
        </div>
      )}

      <div className="lista-proyectos">
        {projects.map((p, i) => (
          <article className="tarjeta-proyecto" key={p.id}>
            <div className="tarjeta-proyecto__encabezado">
              <div className="tarjeta-proyecto__avatar" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                {getInitials(p.name)}
              </div>
              <div className="tarjeta-proyecto__info">
                <h3 className="tarjeta-proyecto__nombre">{p.name}</h3>
                <p className="tarjeta-proyecto__descripcion">
                  {p.description || `${p.repoOwner}/${p.repoName}`}
                </p>
                {p.language && (
                  <span style={{ fontSize: "0.75rem", color: "var(--color-texto-tenue)" }}>
                    {p.language} · rama {p.branch}
                  </span>
                )}
              </div>
              <div className="tarjeta-proyecto__estado">
                <span className={`estado-badge estado-badge--${p.status === "ACTIVE" ? "verificado" : "archivado"}`}>
                  {p.status === "ACTIVE" ? "Activo" : "Archivado"}
                </span>
              </div>
              <button
                className="btn-menu-proyecto"
                aria-label={`Eliminar ${p.name}`}
                onClick={() => handleDeleteProject(p.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", margin: "12px 0", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
                <i className="bi bi-git"></i> {p.repoOwner}/{p.repoName}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
                · {p._count?.scans || 0} escaneos
              </span>
            </div>

            <div className="tarjeta-proyecto__pie">
              <div className="tarjeta-proyecto__acciones">
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secundario btn--sm"
                >
                  <i className="bi bi-github"></i> Repositorio
                </a>
                <button
                  className="btn btn--secundario btn--sm"
                  onClick={() => navigate("/hallazgos")}
                >
                  Ver hallazgos
                </button>
                <button
                  className="btn btn--primario btn--sm"
                  onClick={() => handleStartScan(p.id)}
                  disabled={startingScan === p.id}
                >
                  {startingScan === p.id ? "Iniciando..." : "Iniciar escaneo"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </LayoutApp>
  );
}
