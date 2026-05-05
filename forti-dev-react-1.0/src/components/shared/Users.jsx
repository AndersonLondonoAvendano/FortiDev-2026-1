import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import axios from "axios";
function Users (){

    const BASE_URL = "http://localhost:3000/api"
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        rol: "",
        contrasena: ""
    });
    const [registroLoading, setRegistroLoading] = useState(false);
    const [registroError, setRegistroError] = useState(null);
    const [registroExito, setRegistroExito] = useState(false);
    
    // Estados para editar
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nombre: "",
        email: "",
        rol: "",
        contrasena: ""
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        apiClient.get(`/auth/users`)
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        setRegistroLoading(true);
        setRegistroError(null);
        setRegistroExito(false);

        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                nombre: formData.nombre,
                email: formData.email,
                rol: formData.rol,
                contrasena: formData.contrasena
            });

            if (response.data.user) {
                setRegistroExito(true);
                setFormData({
                    nombre: "",
                    email: "",
                    rol: "",
                    contrasena: ""
                });
                // Recargar la lista de usuarios después del registro
                cargarUsuarios();
                setTimeout(() => setRegistroExito(false), 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error al registrar usuario";
            setRegistroError(errorMessage);
            console.error("Error de registro:", err);
        } finally {
            setRegistroLoading(false);
        }
    };

    // Funciones para editar
    const abrirModalEditar = (user) => {
        setEditingId(user.id);
        setEditFormData({
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            contrasena: ""
        });
        setEditError(null);
    };

    const cerrarModalEditar = () => {
        setEditingId(null);
        setEditFormData({
            nombre: "",
            email: "",
            rol: "",
            contrasena: ""
        });
        setEditError(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditarUsuario = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError(null);

        try {
            const dataToSend = {
                nombre: editFormData.nombre,
                email: editFormData.email,
                rol: editFormData.rol
            };
            
            // Solo incluir contraseña si se proporcionó
            if (editFormData.contrasena) {
                dataToSend.contrasena = editFormData.contrasena;
            }

            const response = await axios.put(`${BASE_URL}/auth/${editingId}`, dataToSend);

            if (response.data.user) {
                cargarUsuarios();
                cerrarModalEditar();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error al editar usuario";
            setEditError(errorMessage);
            console.error("Error de edición:", err);
        } finally {
            setEditLoading(false);
        }
    };

    // Función para eliminar
    const handleEliminarUsuario = async (userId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }

        try {
            const response = await axios.delete(`${BASE_URL}/auth/${userId}`);
            
            if (response.data) {
                cargarUsuarios();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error al eliminar usuario";
            alert(`Error: ${errorMessage}`);
            console.error("Error al eliminar:", err);
        }
    };

    return(
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "30px", borderBottom: "2px solid #ccc", paddingBottom: "20px" }}>
                <h2>Crear nuevo usuario</h2>
                {registroError && (
                    <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
                        Error: {registroError}
                    </div>
                )}
                {registroExito && (
                    <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
                        ¡Usuario registrado exitosamente!
                    </div>
                )}
                <form onSubmit={handleRegistro} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                    <div>
                        <label htmlFor="nombre">Nombre:</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>

                    <div>
                        <label htmlFor="rol">Rol:</label>
                        <select 
                            name="rol" 
                            id="rol"
                            value={formData.rol}
                            onChange={handleInputChange}
                            required
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        >
                            <option value="">Seleccionar rol</option>
                            <option value="admin">Administrador</option>
                            <option value="dev">Desarrollador</option>
                            <option value="analista">Analista de seguridad</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="contrasena">Contraseña:</label>
                        <input 
                            type="password" 
                            name="contrasena" 
                            id="contrasena"
                            value={formData.contrasena}
                            onChange={handleInputChange}
                            required
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={registroLoading}
                        style={{
                            padding: "10px",
                            backgroundColor: registroLoading ? "#ccc" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: registroLoading ? "not-allowed" : "pointer"
                        }}
                    >
                        {registroLoading ? "Creando usuario..." : "Crear Usuario"}
                    </button>
                </form>
            </div>

            <div>
                <h2>Lista de usuarios</h2>
                {loading && <p>Cargando usuarios...</p>}
                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                {!loading && !error && (
                    <>
                        {users.length === 0 ? (
                            <p>No hay usuarios disponibles</p>
                        ) : (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {users.map(user => (
                                    <li 
                                        key={user.id}
                                        style={{
                                            padding: "10px",
                                            marginBottom: "8px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            borderLeft: "4px solid #007bff",
                                            color: "#333",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <div>
                                            <strong>{user.nombre}</strong> ({user.email}) - <span style={{ backgroundColor: "#e7f3ff", padding: "2px 6px", borderRadius: "3px" }}>Rol: {user.rol}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => abrirModalEditar(user)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#28a745",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                                title="Editar usuario"
                                            >
                                            Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminarUsuario(user.id)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                                title="Eliminar usuario"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>

            {/* Modal para editar usuario */}
            {editingId && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        maxWidth: "500px",
                        width: "90%",
                        color: "black"
                    }}>
                        <h2>Editar Usuario</h2>
                        {editError && (
                            <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
                                Error: {editError}
                            </div>
                        )}
                        <form onSubmit={handleEditarUsuario} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div>
                                <label htmlFor="edit-nombre">Nombre:</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    id="edit-nombre"
                                    value={editFormData.nombre}
                                    onChange={handleEditInputChange}
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-email">Email:</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="edit-email"
                                    value={editFormData.email}
                                    onChange={handleEditInputChange}
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-rol">Rol:</label>
                                <select 
                                    name="rol" 
                                    id="edit-rol"
                                    value={editFormData.rol}
                                    onChange={handleEditInputChange}
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                >
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="dev">Desarrollador</option>
                                    <option value="analista">Analista de seguridad</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="edit-contrasena">Contraseña (dejar vacío si no deseas cambiar):</label>
                                <input 
                                    type="password" 
                                    name="contrasena" 
                                    id="edit-contrasena"
                                    value={editFormData.contrasena}
                                    onChange={handleEditInputChange}
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                    placeholder="Opcional"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                <button 
                                    type="submit"
                                    disabled={editLoading}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        backgroundColor: editLoading ? "#ccc" : "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: editLoading ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {editLoading ? "Guardando..." : "Guardar cambios"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={cerrarModalEditar}
                                    disabled={editLoading}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        backgroundColor: "#6c757d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: editLoading ? "not-allowed" : "pointer"
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        
    </div>
  );
}
export default Users;   