/**
 * PaginaGestionUsuarios.jsx
 * Página de administración para gestionar usuarios del sistema.
 * Solo accesible para administradores.
 *
 * Funcionalidades:
 * - Ver lista de todos los usuarios
 * - Editar usuarios (nombre, email, rol)
 * - Cambiar contraseña de usuarios
 * - Eliminar usuarios
 * - Crear nuevos usuarios (modal)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../services/apiClient.js";
import LayoutApp from "../components/shared/LayoutApp.jsx";

export default function PaginaGestionUsuarios() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal de edición
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [formEditar, setFormEditar] = useState({ nombre: "", email: "", rol: "" });

  // Modal de cambiar contraseña
  const [modalPassword, setModalPassword] = useState(false);
  const [usuarioPassword, setUsuarioPassword] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Modal de crear usuario
  const [modalCrear, setModalCrear] = useState(false);
  const [formCrear, setFormCrear] = useState({ nombre: "", email: "", rol: "dev", contrasena: "" });

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await apiClient.get("/auth/users");
      setUsuarios(response.data);
    } catch (err) {
      setError("Error al cargar usuarios: " + (err.response?.data?.message || err.message));
    } finally {
      setCargando(false);
    }
  };

  // Editar usuario
  const abrirEditar = (usuarioData) => {
    setUsuarioEditar(usuarioData);
    setFormEditar({ nombre: usuarioData.nombre, email: usuarioData.email, rol: usuarioData.rol });
    setModalEditar(true);
  };

  const guardarEditar = async () => {
    setError("");
    setSuccess("");
    
    if (!formEditar.nombre || !formEditar.email || !formEditar.rol) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      await apiClient.put(`/auth/${usuarioEditar.id}`, {
        nombre: formEditar.nombre,
        email: formEditar.email,
        rol: formEditar.rol,
      });
      setSuccess("Usuario actualizado exitosamente");
      setModalEditar(false);
      cargarUsuarios();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al actualizar usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // Cambiar contraseña
  const abrirPassword = (usuarioData) => {
    setUsuarioPassword(usuarioData);
    setNuevaPassword("");
    setConfirmarPassword("");
    setModalPassword(true);
  };

  const guardarPassword = async () => {
    setError("");
    setSuccess("");

    if (!nuevaPassword || !confirmarPassword) {
      setError("Ambas contraseñas son requeridas");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      await apiClient.put(`/auth/${usuarioPassword.id}`, {
        nombre: usuarioPassword.nombre,
        email: usuarioPassword.email,
        rol: usuarioPassword.rol,
        contrasena: nuevaPassword,
      });
      setSuccess("Contraseña actualizada exitosamente");
      setModalPassword(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al cambiar contraseña: " + (err.response?.data?.message || err.message));
    }
  };

  // Crear usuario
  const guardarCrear = async () => {
    setError("");
    setSuccess("");

    if (!formCrear.nombre || !formCrear.email || !formCrear.rol || !formCrear.contrasena) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      await apiClient.post("/auth/register", {
        nombre: formCrear.nombre,
        email: formCrear.email,
        rol: formCrear.rol,
        contrasena: formCrear.contrasena,
      });
      setSuccess("Usuario creado exitosamente");
      setModalCrear(false);
      setFormCrear({ nombre: "", email: "", rol: "dev", contrasena: "" });
      cargarUsuarios();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al crear usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id, nombre) => {
    if (id === user?.id) {
      setError("No puedes eliminar tu propia cuenta");
      return;
    }

    if (!window.confirm(`¿Estás seguro que deseas eliminar a ${nombre}?`)) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await apiClient.delete(`/auth/${id}`);
      setSuccess("Usuario eliminado exitosamente");
      cargarUsuarios();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al eliminar usuario: " + (err.response?.data?.message || err.message));
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  return (
    <LayoutApp paginaActiva="gestion-usuarios">
      <div className="contenedor-pagina" style={{ padding: "20px" }}>
        <div className="encabezado-pagina" style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Gestión de Usuarios</h1>
          <p style={{ color: "#666" }}>Administra los usuarios del sistema</p>
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div style={{ backgroundColor: "#fee", color: "#c00", padding: "12px", borderRadius: "4px", marginBottom: "20px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: "#efe", color: "#060", padding: "12px", borderRadius: "4px", marginBottom: "20px" }}>
            {success}
          </div>
        )}

        {/* Botón para crear usuario */}
        <div style={{ marginBottom: "20px" }}>
          <button
            className="btn btn--primario"
            onClick={() => setModalCrear(true)}
            style={{ padding: "10px 20px" }}
          >
            + Crear nuevo usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        {cargando ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No hay usuarios registrados
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#161b22", borderRadius: "8px", overflow: "hidden" , color: "white"}}>
              <thead style={{ backgroundColor: "#161b22", borderBottom: "2px solid #ddd" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Nombre</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Rol</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Fecha de Registro</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{usuario.nombre}</td>
                    <td style={{ padding: "12px" }}>{usuario.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ backgroundColor: usuario.rol === "admin" ? "#ffc107" : usuario.rol === "dev" ? "#17a2b8" : "#28a745", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                        {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{formatearFecha(usuario.created_at)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => abrirEditar(usuario)}
                        style={{ marginRight: "8px", padding: "6px 12px", backgroundColor: "#007bff", color: "#161b22", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => abrirPassword(usuario)}
                        style={{ marginRight: "8px", padding: "6px 12px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                      >
                        Contraseña
                      </button>
                      <button
                        onClick={() => eliminarUsuario(usuario.id, usuario.nombre)}
                        disabled={usuario.id === user?.id}
                        style={{ padding: "6px 12px", backgroundColor: usuario.id === user?.id ? "#ccc" : "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: usuario.id === user?.id ? "not-allowed" : "pointer", fontSize: "12px" }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL: Editar Usuario */}
        {modalEditar && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#3c3e40", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "500px" }}>
              <h2 style={{ marginBottom: "20px" }}>Editar Usuario</h2>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Nombre</label>
                <input
                  type="text"
                  value={formEditar.nombre}
                  onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Email</label>
                <input
                  type="email"
                  value={formEditar.email}
                  onChange={(e) => setFormEditar({ ...formEditar, email: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Rol</label>
                <select
                  value={formEditar.rol}
                  onChange={(e) => setFormEditar({ ...formEditar, rol: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="admin">Administrador</option>
                  <option value="dev">Desarrollador</option>
                  <option value="analista">Analista de seguridad</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModalEditar(false)} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardarEditar} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Cambiar Contraseña */}
        {modalPassword && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#3c3e40", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "500px" }}>
              <h2 style={{ marginBottom: "10px" }}>Cambiar Contraseña</h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>Usuario: {usuarioPassword?.nombre}</p>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Confirma la contraseña"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModalPassword(false)} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardarPassword} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Crear Usuario */}
        {modalCrear && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#3c3e40", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "500px" }}>
              <h2 style={{ marginBottom: "20px" }}>Crear Nuevo Usuario</h2>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Nombre Completo</label>
                <input
                  type="text"
                  value={formCrear.nombre}
                  onChange={(e) => setFormCrear({ ...formCrear, nombre: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Email</label>
                <input
                  type="email"
                  value={formCrear.email}
                  onChange={(e) => setFormCrear({ ...formCrear, email: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Rol</label>
                <select
                  value={formCrear.rol}
                  onChange={(e) => setFormCrear({ ...formCrear, rol: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="admin">Administrador</option>
                  <option value="dev">Desarrollador</option>
                  <option value="analista">Analista de seguridad</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formCrear.contrasena}
                  onChange={(e) => setFormCrear({ ...formCrear, contrasena: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => { setModalCrear(false); setFormCrear({ nombre: "", email: "", rol: "dev", contrasena: "" }); }} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardarCrear} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Crear usuario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutApp>
  );
}
