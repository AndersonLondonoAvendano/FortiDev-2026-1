/**
 * PaginaRegistro.jsx
 * Página de registro con validación robusta
 * - Validación de formato en tiempo real
 * - Indicador de fuerza de contraseña
 * - Validaciones server-side y client-side integradas
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../services/apiClient.js";
import MarcaLogo from "../components/shared/MarcaLogo.jsx";

const STATS_PANEL = [
  { color: "var(--color-critico)", titulo: "Hallazgos críticos",   desc: "Detección y seguimiento en tiempo real" },
  { color: "var(--color-acento)",  titulo: "Pruebas automatizadas", desc: "OWASP ZAP · SonarQube · Nessus" },
  { color: "var(--color-bajo)",    titulo: "Gestión colaborativa",  desc: "Equipos DevSec sincronizados" },
];

const NIVELES_LABELS  = ["", "Débil", "Regular", "Fuerte", "Muy fuerte"];
const NIVELES_CLASES  = ["", "--debil", "--regular", "--fuerte", "--muy-fuerte"];

// Patrones de validación
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
};

// Función para calcular fuerza de contraseña
function calcularFuerza(c) {
  let f = 0;
  if (c.length >= 8)          f++;
  if (/[A-Z]/.test(c))        f++;
  if (/[0-9]/.test(c))        f++;
  if (/[^A-Za-z0-9]/.test(c)) f++;
  return f;
}

export default function PaginaRegistro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]               = useState({ nombre: "", email: "", rol: "", contrasena: "" });
  const [verContrasena, setVerContrasena] = useState(false);
  const [errores, setErrores]         = useState({});
  const [fuerzaContrasena, setFuerza] = useState(0);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Validar nombre
  const validarNombre = (valor) => {
    if (!valor.trim()) {
      return "Por favor ingresa tu nombre completo.";
    }
    if (!PATTERNS.nombre.test(valor.trim())) {
      return "El nombre solo puede contener letras y espacios.";
    }
    if (valor.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres.";
    }
    return "";
  };

  // Validar email
  const validarEmail = (valor) => {
    if (!valor.trim()) {
      return "Por favor ingresa tu correo electrónico.";
    }
    if (!PATTERNS.email.test(valor.trim())) {
      return "Por favor ingresa un correo electrónico válido.";
    }
    return "";
  };

  // Validar contraseña
  const validarContraseña = (valor) => {
    if (!valor.trim()) {
      return "Por favor crea una contraseña.";
    }
    if (valor.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    const fuerza = calcularFuerza(valor);
    if (fuerza < 2) {
      return "La contraseña debe ser al menos regular (mayúsculas, números y símbolos).";
    }
    return "";
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (field === "contrasena") {
      setFuerza(calcularFuerza(value));
    }

    // Validar en tiempo real si el campo fue tocado
    if (touchedFields[field]) {
      validarCampo(field, value);
    }
  };

  // Validar un campo específico
  const validarCampo = (field, value) => {
    const newErrores = { ...errores };
    
    switch (field) {
      case "nombre":
        newErrores.nombre = validarNombre(value);
        break;
      case "email":
        newErrores.email = validarEmail(value);
        break;
      case "rol":
        newErrores.rol = !value ? "Por favor selecciona un rol." : "";
        break;
      case "contrasena":
        newErrores.contrasena = validarContraseña(value);
        break;
      default:
        break;
    }
    
    setErrores(newErrores);
  };

  const handleFieldBlur = (field) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    validarCampo(field, form[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const errs = {};
    errs.nombre = validarNombre(form.nombre);
    errs.email = validarEmail(form.email);
    errs.rol = !form.rol ? "Por favor selecciona un rol." : "";
    errs.contrasena = validarContraseña(form.contrasena);
    
    if (!aceptaTerminos) {
      errs.terminos = "Debes aceptar los términos de servicio y la política de privacidad.";
    }

    setErrores(errs);
    
    if (Object.values(errs).some(e => e)) {
      return;
    }

    // Llamada a la API para registrar
    setCargando(true);
    try {
      // Paso 1: Registrar el usuario
      await apiClient.post('/auth/register', {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        rol: form.rol,
        contrasena: form.contrasena,
      });

      // Paso 2: Hacer login automático para obtener el token
      const loginResponse = await apiClient.post('/auth/login', {
        email: form.email.trim(),
        contrasena: form.contrasena,
      });

      // Paso 3: Guardar datos en el contexto de autenticación
      login(loginResponse.data.user, loginResponse.data.token);

      // Paso 4: Navegar al dashboard
      navigate("/dashboard");
    } catch (error) {
      setCargando(false);
      
      // Manejar errores de validación del servidor
      if (error.response?.data?.errors) {
        setErrores(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrores({ servidor: error.response.data.message });
      } else if (error.message === 'Network Error') {
        setErrores({ servidor: "Error de conexión. Intenta de nuevo." });
      } else {
        setErrores({ servidor: "Ocurrió un error desconocido." });
      }
    }
  };

  return (
    <div className="contenedor-autenticacion pagina-autenticacion">

      {/* ── PANEL IZQUIERDO ── */}
      <aside className="panel-info-sistema" aria-hidden="true">
        <div className="panel-info-sistema__contenido">
          <button
            className="encabezado-principal__marca btn-reset"
            style={{ marginBottom: "48px" }}
            onClick={() => navigate("/")}
          >
            <MarcaLogo />
          </button>

          <blockquote className="panel-info-sistema__cita">
            "La seguridad no es un producto, sino un proceso continuo integrado
            en cada etapa del desarrollo."
          </blockquote>

          <div className="panel-info-sistema__stats">
            {STATS_PANEL.map(({ color, titulo, desc }) => (
              <div className="panel-stat" key={titulo}>
                <span className="panel-stat__icono" style={{ color }}>
                  <i className="bi bi-circle-fill" style={{ fontSize: "0.5rem" }}></i>
                </span>
                <div>
                  <div className="panel-stat__titulo">{titulo}</div>
                  <div className="panel-stat__desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel-info-sistema__fondo-decorativo" aria-hidden="true">
            <div className="deco-hexagono"></div>
          </div>
        </div>
      </aside>

      {/* ── PANEL DERECHO ── */}
      <main className="panel-formulario" id="contenido-principal">
        <div className="formulario-registro__contenedor">

          <div className="formulario-registro__encabezado">
            <h1 className="formulario-registro__titulo">Crear cuenta</h1>
            <p className="formulario-registro__subtitulo">
              Únete a FortiDev para gestionar la seguridad de tus proyectos.
            </p>
          </div>

          <div className="formulario-registro">

            {/* Nombre + Rol */}
            <div className="registro-fila-doble">
              <div className="campo-grupo">
                <label className="campo-etiqueta" htmlFor="registro-nombre">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="registro-nombre"
                  className={`campo-input ${errores.nombre ? "campo-input--error" : ""}`}
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={(e) => handleFormChange("nombre", e.target.value)}
                  onBlur={() => handleFieldBlur("nombre")}
                  aria-invalid={!!errores.nombre}
                  aria-describedby={errores.nombre ? "error-nombre" : undefined}
                />
                {errores.nombre && (
                  <span className="campo-error" id="error-nombre" role="alert">{errores.nombre}</span>
                )}
              </div>

              <div className="campo-grupo">
                <label className="campo-etiqueta" htmlFor="registro-rol">Rol</label>
                <select
                  id="registro-rol"
                  className={`campo-input campo-select ${errores.rol ? "campo-input--error" : ""}`}
                  value={form.rol}
                  onChange={(e) => handleFormChange("rol", e.target.value)}
                  onBlur={() => handleFieldBlur("rol")}
                  aria-invalid={!!errores.rol}
                  aria-describedby={errores.rol ? "error-rol" : undefined}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="dev">Desarrollador</option>
                  <option value="analista">Analista de seguridad</option>
                </select>
                {errores.rol && (
                  <span className="campo-error" id="error-rol" role="alert">{errores.rol}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="campo-grupo">
              <label className="campo-etiqueta" htmlFor="registro-email">
                Correo electrónico
              </label>
              <div className="campo-input-wrapper">
                <span className="campo-input-icono">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  id="registro-email"
                  className={`campo-input campo-input--con-icono ${errores.email ? "campo-input--error" : ""}`}
                  placeholder="correo@empresa.com"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  aria-invalid={!!errores.email}
                  aria-describedby={errores.email ? "error-email" : undefined}
                />
              </div>
              {errores.email && (
                <span className="campo-error" id="error-email" role="alert">{errores.email}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="campo-grupo">
              <label className="campo-etiqueta" htmlFor="registro-contrasena">
                Contraseña
              </label>
              <div className="campo-input-wrapper">
                <span className="campo-input-icono">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={verContrasena ? "text" : "password"}
                  id="registro-contrasena"
                  className={`campo-input campo-input--con-icono ${errores.contrasena ? "campo-input--error" : ""}`}
                  placeholder="Mínimo 8 caracteres"
                  value={form.contrasena}
                  onChange={(e) => handleFormChange("contrasena", e.target.value)}
                  onBlur={() => handleFieldBlur("contrasena")}
                  aria-invalid={!!errores.contrasena}
                  aria-describedby={errores.contrasena ? "error-contrasena" : "strength-indicator"}
                />
                <button
                  type="button"
                  className="btn-toggle-contrasena"
                  onClick={() => setVerContrasena(!verContrasena)}
                  tabIndex={-1}
                  aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`bi ${verContrasena ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>

              {/* Indicador de fuerza */}
              {form.contrasena && (
                <>
                  <div className="indicador-fuerza" id="strength-indicator">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`indicador-fuerza__barra${
                          i <= fuerzaContrasena
                            ? ` indicador-fuerza__barra${NIVELES_CLASES[fuerzaContrasena]}`
                            : ""
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="indicador-fuerza__texto">
                    {NIVELES_LABELS[fuerzaContrasena]}
                  </div>
                </>
              )}

              {errores.contrasena && (
                <span className="campo-error" id="error-contrasena" role="alert">{errores.contrasena}</span>
              )}
            </div>

            {/* Términos */}
            <label className="checkbox-personalizado">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => {
                  setAceptaTerminos(e.target.checked);
                  if (e.target.checked) {
                    setErrores({ ...errores, terminos: "" });
                  }
                }}
                aria-invalid={!!errores.terminos}
                aria-describedby={errores.terminos ? "error-terminos" : undefined}
              />
              <span className="checkbox-personalizado__indicador"></span>
              <span className="checkbox-personalizado__etiqueta">
                Acepto los{" "}
                <a href="#" className="enlace-interno">Términos de servicio</a> y la{" "}
                <a href="#" className="enlace-interno">Política de privacidad</a>
              </span>
            </label>
            {errores.terminos && (
              <span className="campo-error" id="error-terminos" role="alert">{errores.terminos}</span>
            )}

            {errores.servidor && (
              <div className="campo-error" role="alert" style={{ display: "block", padding: "10px", backgroundColor: "#fee", borderRadius: "4px" }}>
                {errores.servidor}
              </div>
            )}

            <button
              className="btn btn--primario btn-registro"
              onClick={handleSubmit}
              disabled={cargando || Object.values(errores).some(e => e && e !== "")}
              aria-busy={cargando}
            >
              {cargando ? "Registrando..." : "Crear cuenta"}
            </button>
          </div>

          <div className="formulario-registro__separador">
            <span>o regístrate con</span>
          </div>

          <div className="opciones-oauth">
            <button type="button" className="btn btn--secundario btn-oauth">
              <span>⌥</span> GitHub
            </button>
            <button type="button" className="btn btn--secundario btn-oauth">
              <span>G</span> Google
            </button>
          </div>

          <p className="formulario-registro__login">
            ¿Ya tienes cuenta?{" "}
            <button
              className="btn-reset enlace-interno"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </p>
        </div>

        <footer className="panel-formulario__pie">
          <p>© 2026 FortiDev · Tecnológico de Antioquia</p>
          <nav>
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Soporte</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
