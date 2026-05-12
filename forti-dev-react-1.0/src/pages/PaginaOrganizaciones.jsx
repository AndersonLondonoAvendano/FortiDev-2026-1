import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import * as orgsApi from "../api/organizations.js";

const ROLE_LABELS = { OWNER: "Propietario", ADMIN: "Admin", MEMBER: "Miembro", VIEWER: "Visor" };
const ROLE_COLORS = { OWNER: "var(--color-acento)", ADMIN: "var(--color-alto)", MEMBER: "var(--color-bajo)", VIEWER: "var(--color-texto-tenue)" };

function getInitials(name = "") {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function PaginaOrganizaciones() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orgsApi.listOrganizations();
      setOrgs(data);
    } catch {
      setError("Error al cargar las organizaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrgs(); }, [fetchOrgs]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("El nombre es obligatorio."); return; }
    setSubmitting(true);
    setFormError("");
    try {
      await orgsApi.createOrganization(form);
      setShowForm(false);
      setForm({ name: "", description: "" });
      await fetchOrgs();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al crear la organización.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LayoutApp pagina="organizaciones" tituloBarra="Organizaciones" placeholderBusqueda="Buscar organizaciones...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Mis organizaciones</h2>
          <p className="encabezado-pagina__descripcion">
            {orgs.length} organización{orgs.length !== 1 ? "es" : ""}
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario" onClick={() => setShowForm(true)}>
            + Nueva organización
          </button>
        </div>
      </div>

      {/* ── FORMULARIO CREAR ── */}
      {showForm && (
        <div style={{ background: "var(--color-superficie)", border: "1px solid var(--color-borde)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>Crear organización</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gap: "12px" }}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombre *</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Ej: Acme Corp"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Descripción</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Descripción opcional"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            {formError && <p style={{ color: "var(--color-critico)", marginTop: "8px" }}>{formError}</p>}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button type="submit" className="btn btn--primario" disabled={submitting}>
                {submitting ? "Creando..." : "Crear"}
              </button>
              <button type="button" className="btn btn--secundario" onClick={() => { setShowForm(false); setFormError(""); }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ESTADO ── */}
      {loading && <p style={{ padding: "20px", textAlign: "center" }}>Cargando organizaciones...</p>}
      {error && <p style={{ color: "var(--color-critico)", padding: "20px", textAlign: "center" }}>{error}</p>}

      {!loading && !error && orgs.length === 0 && (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
          <i className="bi bi-building" style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}></i>
          <p>No perteneces a ninguna organización todavía.</p>
          <button className="btn btn--primario" style={{ marginTop: "16px" }} onClick={() => setShowForm(true)}>
            Crear primera organización
          </button>
        </div>
      )}

      {/* ── LISTA ── */}
      <div style={{ display: "grid", gap: "16px" }}>
        {orgs.map((org) => {
          const myRole = org.members?.[0]?.role;
          return (
            <article
              key={org.id}
              className="tarjeta-proyecto"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/organizaciones/${org.id}`)}
            >
              <div className="tarjeta-proyecto__encabezado">
                <div className="tarjeta-proyecto__avatar" style={{ background: "linear-gradient(135deg,#6c63ff,#3b82f6)", fontSize: "1.2rem" }}>
                  {getInitials(org.name)}
                </div>
                <div className="tarjeta-proyecto__info">
                  <h3 className="tarjeta-proyecto__nombre">{org.name}</h3>
                  <p className="tarjeta-proyecto__descripcion">
                    {org.description || `/${org.slug}`}
                  </p>
                </div>
                {myRole && (
                  <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "999px", background: "var(--color-fondo)", color: ROLE_COLORS[myRole], border: `1px solid ${ROLE_COLORS[myRole]}` }}>
                    {ROLE_LABELS[myRole]}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "24px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--color-borde)", fontSize: "0.85rem", color: "var(--color-texto-tenue)" }}>
                <span><i className="bi bi-people"></i> {org._count?.members ?? 0} miembro{org._count?.members !== 1 ? "s" : ""}</span>
                <span><i className="bi bi-folder2"></i> {org._count?.projects ?? 0} proyecto{org._count?.projects !== 1 ? "s" : ""}</span>
              </div>
            </article>
          );
        })}
      </div>
    </LayoutApp>
  );
}
