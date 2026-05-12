import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import * as orgsApi from "../api/organizations.js";

const TABS = [
  { id: "proyectos", label: "Proyectos", icon: "bi-folder2" },
  { id: "miembros", label: "Miembros", icon: "bi-people" },
  { id: "configuracion", label: "Configuración", icon: "bi-gear" },
];

const ROLE_LABELS = { OWNER: "Propietario", ADMIN: "Admin", MEMBER: "Miembro", VIEWER: "Visor" };
const ROLE_COLORS = { OWNER: "var(--color-acento)", ADMIN: "var(--color-alto)", MEMBER: "var(--color-bajo)", VIEWER: "var(--color-texto-tenue)" };
const ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

function getInitials(name = "") {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ── Tab Proyectos ─────────────────────────────────────────────────────────────
function TabProyectos({ orgId }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orgsApi.listOrgProjects(orgId)
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) return <p style={{ padding: "24px", color: "var(--color-texto-tenue)" }}>Cargando proyectos...</p>;
  if (projects.length === 0) return (
    <div style={{ padding: "48px", textAlign: "center", color: "var(--color-texto-tenue)" }}>
      <i className="bi bi-folder2-open" style={{ fontSize: "2rem", display: "block", marginBottom: "12px" }}></i>
      <p>Esta organización no tiene proyectos aún.</p>
      <button className="btn btn--primario" style={{ marginTop: "12px" }} onClick={() => navigate("/proyectos")}>
        Ir a Proyectos
      </button>
    </div>
  );

  return (
    <div className="lista-proyectos" style={{ marginTop: "0" }}>
      {projects.map((p) => (
        <article className="tarjeta-proyecto" key={p.id}>
          <div className="tarjeta-proyecto__encabezado">
            <div className="tarjeta-proyecto__avatar" style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
              {getInitials(p.name)}
            </div>
            <div className="tarjeta-proyecto__info">
              <h3 className="tarjeta-proyecto__nombre">{p.name}</h3>
              <p className="tarjeta-proyecto__descripcion">{p.description || `${p.repoOwner}/${p.repoName}`}</p>
            </div>
            <span className={`estado-badge estado-badge--${p.status === "ACTIVE" ? "verificado" : "archivado"}`}>
              {p.status === "ACTIVE" ? "Activo" : "Archivado"}
            </span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
            <i className="bi bi-git"></i> {p.repoOwner}/{p.repoName} · {p._count?.scans ?? 0} escaneos
          </div>
        </article>
      ))}
    </div>
  );
}

// ── Tab Miembros ──────────────────────────────────────────────────────────────
function TabMiembros({ orgId, myRole }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  const fetchMembers = useCallback(() => {
    setLoading(true);
    orgsApi.listOrgMembers(orgId)
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orgId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    try {
      await orgsApi.inviteMember(orgId, { email: inviteEmail, role: inviteRole });
      setInviteEmail("");
      setInviteRole("MEMBER");
      fetchMembers();
    } catch (err) {
      setInviteError(err.response?.data?.error || "Error al invitar al usuario.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      await orgsApi.updateMemberRole(orgId, userId, role);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.error || "Error al cambiar el rol.");
    }
  }

  async function handleRemove(userId) {
    if (!window.confirm("¿Remover este miembro de la organización?")) return;
    try {
      await orgsApi.removeMember(orgId, userId);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.error || "Error al remover el miembro.");
    }
  }

  return (
    <div>
      {/* ── Invitar ── */}
      {canManage && (
        <div style={{ background: "var(--color-fondo)", border: "1px solid var(--color-borde)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "12px", fontSize: "0.95rem" }}>Invitar miembro por email</h4>
          <form onSubmit={handleInvite} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="email"
              className="campo-input"
              placeholder="email@ejemplo.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{ flex: "1", minWidth: "200px" }}
              required
            />
            <select
              className="campo-input campo-select"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{ width: "140px" }}
            >
              {ROLES.filter((r) => r !== "OWNER").map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <button type="submit" className="btn btn--primario" disabled={inviting}>
              {inviting ? "Invitando..." : "Invitar"}
            </button>
          </form>
          {inviteError && <p style={{ color: "var(--color-critico)", marginTop: "8px", fontSize: "0.85rem" }}>{inviteError}</p>}
        </div>
      )}

      {/* ── Lista de miembros ── */}
      {loading ? (
        <p style={{ color: "var(--color-texto-tenue)" }}>Cargando miembros...</p>
      ) : (
        <div className="contenedor-tabla-scroll">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Email</th>
                <th>Rol en plataforma</th>
                <th>Rol en org</th>
                <th>Desde</th>
                {canManage && <th className="th-acciones"><span className="sr-only">Acciones</span></th>}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.user.name}</td>
                  <td style={{ color: "var(--color-texto-tenue)" }}>{m.user.email}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>{m.user.role}</td>
                  <td>
                    {canManage && m.role !== "OWNER" && m.user.id !== user?.id ? (
                      <select
                        className="campo-input campo-select"
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.user.id, e.target.value)}
                        style={{ fontSize: "0.8rem", padding: "4px 8px", width: "auto" }}
                      >
                        {ROLES.filter((r) => r !== "OWNER").map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: ROLE_COLORS[m.role] }}>{ROLE_LABELS[m.role]}</span>
                    )}
                  </td>
                  <td style={{ color: "var(--color-texto-tenue)", fontSize: "0.82rem" }}>
                    {new Date(m.joinedAt).toLocaleDateString("es-CO")}
                  </td>
                  {canManage && (
                    <td className="celda-acciones">
                      {m.role !== "OWNER" && m.user.id !== user?.id && (
                        <button
                          className="btn-accion-fila"
                          title="Remover miembro"
                          onClick={() => handleRemove(m.user.id)}
                          style={{ color: "var(--color-critico)" }}
                        >
                          <i className="bi bi-person-dash"></i>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tab Configuración ─────────────────────────────────────────────────────────
function TabConfiguracion({ org, myRole, onUpdated, onDeleted }) {
  const [form, setForm] = useState({ name: org.name, description: org.description || "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await orgsApi.updateOrganization(org.id, form);
      setSaveMsg("Cambios guardados.");
      onUpdated();
    } catch (err) {
      setSaveMsg(err.response?.data?.error || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar la organización "${org.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await orgsApi.deleteOrganization(org.id);
      onDeleted();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar.");
      setDeleting(false);
    }
  }

  const isOwner = myRole === "OWNER";

  return (
    <div style={{ maxWidth: "540px" }}>
      <h4 style={{ marginBottom: "16px" }}>Información general</h4>
      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gap: "12px" }}>
          <div className="campo-grupo">
            <label className="campo-etiqueta">Nombre</label>
            <input
              type="text"
              className="campo-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={!isOwner}
              required
            />
          </div>
          <div className="campo-grupo">
            <label className="campo-etiqueta">Descripción</label>
            <input
              type="text"
              className="campo-input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              disabled={!isOwner && myRole !== "ADMIN"}
            />
          </div>
          <div className="campo-grupo">
            <label className="campo-etiqueta">Slug (URL)</label>
            <input type="text" className="campo-input" value={org.slug} disabled style={{ opacity: 0.5 }} />
          </div>
        </div>
        {saveMsg && <p style={{ marginTop: "8px", color: saveMsg.includes("Error") ? "var(--color-critico)" : "var(--color-bajo)" }}>{saveMsg}</p>}
        {(isOwner || myRole === "ADMIN") && (
          <button type="submit" className="btn btn--primario" style={{ marginTop: "16px" }} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </form>

      {isOwner && (
        <div style={{ marginTop: "32px", padding: "20px", borderRadius: "10px", border: "1px solid var(--color-critico)", background: "rgba(239,68,68,0.05)" }}>
          <h4 style={{ color: "var(--color-critico)", marginBottom: "8px" }}>Zona de peligro</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-texto-tenue)", marginBottom: "16px" }}>
            Eliminar la organización es permanente y borra todos los datos asociados.
          </p>
          <button className="btn" style={{ background: "var(--color-critico)", color: "#fff" }} onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar organización"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function PaginaDetalleOrganizacion() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState("proyectos");

  const fetchOrg = useCallback(() => {
    setLoading(true);
    orgsApi.getOrganization(id)
      .then(setOrg)
      .catch(() => navigate("/organizaciones"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => { fetchOrg(); }, [fetchOrg]);

  if (loading) return (
    <LayoutApp pagina="organizaciones" tituloBarra="Organización">
      <p style={{ padding: "40px", textAlign: "center" }}>Cargando organización...</p>
    </LayoutApp>
  );

  if (!org) return null;

  const myMembership = org.members?.find((m) => m.user.id === user?.id);
  const myRole = myMembership?.role;

  return (
    <LayoutApp pagina="organizaciones" tituloBarra={org.name} placeholderBusqueda="Buscar...">

      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <button
            className="btn btn--secundario btn--sm"
            style={{ marginBottom: "8px" }}
            onClick={() => navigate("/organizaciones")}
          >
            <i className="bi bi-arrow-left"></i> Organizaciones
          </button>
          <h2 className="encabezado-pagina__titulo">{org.name}</h2>
          <p className="encabezado-pagina__descripcion">
            {org.description || `/${org.slug}`} · {org._count?.members ?? org.members.length} miembro{org._count?.members !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── TABS ── */}
      <nav className="tabs-navegacion" aria-label="Secciones de la organización">
        {TABS.map(({ id: tid, label, icon }) => (
          <button
            key={tid}
            className={`tab-item btn-reset${tabActiva === tid ? " tab-item--activo" : ""}`}
            onClick={() => setTabActiva(tid)}
          >
            <i className={`bi ${icon}`}></i> {label}
          </button>
        ))}
      </nav>

      {/* ── CONTENIDO ── */}
      <div style={{ marginTop: "20px" }}>
        {tabActiva === "proyectos" && <TabProyectos orgId={id} />}
        {tabActiva === "miembros" && <TabMiembros orgId={id} myRole={myRole} />}
        {tabActiva === "configuracion" && (
          <TabConfiguracion
            org={org}
            myRole={myRole}
            onUpdated={fetchOrg}
            onDeleted={() => navigate("/organizaciones")}
          />
        )}
      </div>
    </LayoutApp>
  );
}
