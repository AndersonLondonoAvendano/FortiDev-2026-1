import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import * as usersApi from "../api/users.js";
import * as authApi from "../api/auth.js";

const ROLES = ["ADMIN", "DEVELOPER", "ANALYST", "PENTESTER"];
const ROLE_COLORS = {
  ADMIN: "var(--color-critico)",
  DEVELOPER: "var(--color-bajo)",
  ANALYST: "var(--color-acento)",
  PENTESTER: "var(--color-medio)",
};

export default function PaginaGestionUsuarios() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [formEditar, setFormEditar] = useState({ name: "", email: "", role: "" });

  const [modalPassword, setModalPassword] = useState(false);
  const [usuarioPassword, setUsuarioPassword] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [modalCrear, setModalCrear] = useState(false);
  const [formCrear, setFormCrear] = useState({ name: "", email: "", role: "DEVELOPER", password: "" });

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 5000); };

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setUsuarios(await usersApi.listUsers());
    } catch (err) {
      showError("Error al cargar usuarios: " + (err.response?.data?.error || err.message));
    } finally { setCargando(false); }
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const abrirEditar = (u) => {
    setUsuarioEditar(u);
    setFormEditar({ name: u.name, email: u.email, role: u.role });
    setModalEditar(true);
  };

  const guardarEditar = async () => {
    setError("");
    if (!formEditar.name || !formEditar.email || !formEditar.role) {
      showError("Todos los campos son requeridos");
      return;
    }
    try {
      await usersApi.updateUser(usuarioEditar.id, formEditar);
      showSuccess("Usuario actualizado correctamente");
      setModalEditar(false);
      cargarUsuarios();
    } catch (err) {
      showError("Error al actualizar: " + (err.response?.data?.error || err.message));
    }
  };

  const abrirPassword = (u) => {
    setUsuarioPassword(u);
    setNuevaPassword("");
    setConfirmarPassword("");
    setModalPassword(true);
  };

  const guardarPassword = async () => {
    setError("");
    if (!nuevaPassword || nuevaPassword !== confirmarPassword) {
      showError("Las contraseñas no coinciden o están vacías");
      return;
    }
    if (nuevaPassword.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    try {
      await usersApi.changePassword(usuarioPassword.id, { newPassword: nuevaPassword });
      showSuccess("Contraseña actualizada correctamente");
      setModalPassword(false);
    } catch (err) {
      showError("Error al cambiar contraseña: " + (err.response?.data?.error || err.message));
    }
  };

  const crearUsuario = async () => {
    setError("");
    if (!formCrear.name || !formCrear.email || !formCrear.password) {
      showError("Nombre, email y contraseña son obligatorios");
      return;
    }
    try {
      await authApi.register(formCrear);
      showSuccess("Usuario creado correctamente");
      setModalCrear(false);
      setFormCrear({ name: "", email: "", role: "DEVELOPER", password: "" });
      cargarUsuarios();
    } catch (err) {
      showError("Error al crear usuario: " + (err.response?.data?.error || err.message));
    }
  };

  const eliminarUsuario = async (id) => {
    if (id === currentUser?.id) { showError("No puedes desactivar tu propia cuenta"); return; }
    if (!window.confirm("¿Desactivar este usuario?")) return;
    try {
      await usersApi.deleteUser(id);
      showSuccess("Usuario desactivado");
      cargarUsuarios();
    } catch (err) {
      showError("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <LayoutApp pagina="usuarios" tituloBarra="Gestión de Usuarios" placeholderBusqueda="Buscar usuarios...">

      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Gestión de usuarios</h2>
          <p className="encabezado-pagina__descripcion">{usuarios.length} usuarios registrados</p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario" onClick={() => setModalCrear(true)}>+ Nuevo usuario</button>
        </div>
      </div>

      {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>{success}</div>}

      {cargando ? (
        <p style={{ padding: "40px", textAlign: "center" }}>Cargando usuarios...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-borde)", textAlign: "left" }}>
                {["Nombre", "Email", "Rol", "Estado", "Creado", "Acciones"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", fontSize: "0.8rem", color: "var(--color-texto-tenue)", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--color-borde)" }}>
                  <td style={{ padding: "12px" }}>{u.name}</td>
                  <td style={{ padding: "12px", color: "var(--color-texto-tenue)", fontSize: "0.9rem" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: ROLE_COLORS[u.role] + "22", color: ROLE_COLORS[u.role], padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: u.isActive ? "var(--color-bajo)" : "var(--color-critico)", fontSize: "0.8rem" }}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: "0.8rem", color: "var(--color-texto-tenue)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="btn btn--secundario btn--sm" onClick={() => abrirEditar(u)}>Editar</button>
                      <button className="btn btn--secundario btn--sm" onClick={() => abrirPassword(u)}>Contraseña</button>
                      {u.id !== currentUser?.id && (
                        <button className="btn btn--sm" style={{ background: "var(--color-critico)22", color: "var(--color-critico)", border: "1px solid var(--color-critico)44", borderRadius: "6px", cursor: "pointer", padding: "4px 10px" }} onClick={() => eliminarUsuario(u.id)}>
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL EDITAR ── */}
      {modalEditar && (
        <div style={{ position: "fixed", inset: 0, background: "#0008", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--color-superficie)", borderRadius: "12px", padding: "28px", width: "420px", maxWidth: "90vw" }}>
            <h3 style={{ marginBottom: "16px" }}>Editar usuario</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombre</label>
                <input className="campo-input" value={formEditar.name} onChange={(e) => setFormEditar((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Email</label>
                <input className="campo-input" type="email" value={formEditar.email} onChange={(e) => setFormEditar((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Rol</label>
                <select className="campo-input" value={formEditar.role} onChange={(e) => setFormEditar((f) => ({ ...f, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn btn--primario" onClick={guardarEditar}>Guardar</button>
              <button className="btn btn--secundario" onClick={() => setModalEditar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONTRASEÑA ── */}
      {modalPassword && (
        <div style={{ position: "fixed", inset: 0, background: "#0008", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--color-superficie)", borderRadius: "12px", padding: "28px", width: "380px", maxWidth: "90vw" }}>
            <h3 style={{ marginBottom: "16px" }}>Cambiar contraseña — {usuarioPassword?.name}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nueva contraseña</label>
                <input className="campo-input" type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Confirmar contraseña</label>
                <input className="campo-input" type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn btn--primario" onClick={guardarPassword}>Actualizar</button>
              <button className="btn btn--secundario" onClick={() => setModalPassword(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR ── */}
      {modalCrear && (
        <div style={{ position: "fixed", inset: 0, background: "#0008", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--color-superficie)", borderRadius: "12px", padding: "28px", width: "420px", maxWidth: "90vw" }}>
            <h3 style={{ marginBottom: "16px" }}>Crear nuevo usuario</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Nombre completo *</label>
                <input className="campo-input" value={formCrear.name} onChange={(e) => setFormCrear((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Email *</label>
                <input className="campo-input" type="email" value={formCrear.email} onChange={(e) => setFormCrear((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Contraseña *</label>
                <input className="campo-input" type="password" value={formCrear.password} onChange={(e) => setFormCrear((f) => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="campo-grupo">
                <label className="campo-etiqueta">Rol</label>
                <select className="campo-input" value={formCrear.role} onChange={(e) => setFormCrear((f) => ({ ...f, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn btn--primario" onClick={crearUsuario}>Crear</button>
              <button className="btn btn--secundario" onClick={() => { setModalCrear(false); setFormCrear({ name: "", email: "", role: "DEVELOPER", password: "" }); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </LayoutApp>
  );
}
