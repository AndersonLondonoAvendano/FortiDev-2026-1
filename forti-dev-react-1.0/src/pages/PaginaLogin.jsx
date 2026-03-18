/**
 * PaginaLogin.jsx
 * Página de inicio de sesión (login.html).
 * Reemplaza: LoginGuardarNombre.js + ValidarCamposVacios.js + MostrarOcultarContrasena.js
 *
 * - Validación de campos con estado local
 * - Toggle mostrar/ocultar contraseña con useState
 * - Simulación de login → reemplazar setTimeout con fetch() al backend
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import MarcaLogo from "../components/shared/MarcaLogo.jsx";

const STATS_PANEL = [
  { color: "var(--color-critico)", titulo: "Hallazgos críticos",   desc: "Detección y seguimiento en tiempo real" },
  { color: "var(--color-acento)",  titulo: "Pruebas automatizadas", desc: "OWASP ZAP · SonarQube · Nessus" },
  { color: "var(--color-bajo)",    titulo: "Gestión colaborativa",  desc: "Equipos DevSec sincronizados" },
];

export default function PaginaLogin({ onNavegar }) {
  const { login } = useAuth();

  const [email,          setEmail]          = useState("");
  const [contrasena,     setContrasena]     = useState("");
  const [verContrasena,  setVerContrasena]  = useState(false);
  const [errorEmail,     setErrorEmail]     = useState("");
  const [errorContrasena,setErrorContrasena]= useState("");
  const [alertaGlobal,   setAlertaGlobal]   = useState("");
  const [cargando,       setCargando]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorContrasena("");
    setAlertaGlobal("");

    let valido = true;
    if (!email)     { setErrorEmail("Por favor ingresa tu correo electrónico."); valido = false; }
    if (!contrasena){ setErrorContrasena("Por favor ingresa tu contraseña."); valido = false; }
    if (!valido) return;

    setCargando(true);
    // TODO: reemplazar con fetch POST /api/auth/login
    setTimeout(() => {
      login("Anderson");
      onNavegar("dashboard");
      setCargando(false);
    }, 800);
  };

  return (
    <div className="contenedor-autenticacion pagina-autenticacion">

      {/* ── PANEL IZQUIERDO ── */}
      <aside className="panel-info-sistema" aria-hidden="true">
        <div className="panel-info-sistema__contenido">
          <button
            className="encabezado-principal__marca btn-reset"
            style={{ marginBottom: "48px" }}
            onClick={() => onNavegar("inicio")}
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
        <div className="formulario-acceso__contenedor">

          <div className="formulario-acceso__encabezado">
            <h1 className="formulario-acceso__titulo">Bienvenido de nuevo</h1>
            <p className="formulario-acceso__subtitulo">
              Accede a tu cuenta para continuar gestionando la seguridad de tus
              proyectos.
            </p>
          </div>

          <div className="formulario-acceso">

            {/* Email */}
            <div className="campo-grupo">
              <label className="campo-etiqueta" htmlFor="acceso-email">
                Correo electrónico
              </label>
              <div className="campo-input-wrapper">
                <span className="campo-input-icono">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  id="acceso-email"
                  className="campo-input campo-input--con-icono"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {errorEmail && (
                <span className="campo-error" role="alert">{errorEmail}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="campo-grupo">
              <label className="campo-etiqueta" htmlFor="acceso-contrasena">
                Contraseña
              </label>
              <div className="campo-input-wrapper">
                <span className="campo-input-icono">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={verContrasena ? "text" : "password"}
                  id="acceso-contrasena"
                  className="campo-input campo-input--con-icono"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-contrasena"
                  aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setVerContrasena(!verContrasena)}
                >
                  <i className={`bi ${verContrasena ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errorContrasena && (
                <span className="campo-error" role="alert">{errorContrasena}</span>
              )}
            </div>

            {/* Recordar / Recuperar */}
            <div className="campo-grupo campo-grupo--horizontal">
              <label className="checkbox-personalizado">
                <input type="checkbox" id="recordar-sesion" />
                <span className="checkbox-personalizado__indicador"></span>
                <span className="checkbox-personalizado__etiqueta">Recordar sesión</span>
              </label>
              <a href="#" className="enlace-recuperar">¿Olvidaste tu contraseña?</a>
            </div>

            {/* Botón */}
            <button
              className="btn btn--primario btn-acceso"
              onClick={handleSubmit}
              disabled={cargando}
            >
              <span className="btn-acceso__texto">
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </span>
            </button>

            {alertaGlobal && (
              <div className="alerta-formulario" role="alert">
                {alertaGlobal}
              </div>
            )}
          </div>

          <div className="formulario-acceso__separador">
            <span>o continúa con</span>
          </div>

          <div className="opciones-oauth">
            <button type="button" className="btn btn--secundario btn-oauth">
              <span>⌥</span> GitHub
            </button>
            <button type="button" className="btn btn--secundario btn-oauth">
              <span>G</span> Google
            </button>
          </div>

          <p className="formulario-acceso__registro">
            ¿No tienes cuenta?{" "}
            <button
              className="btn-reset enlace-interno"
              onClick={() => onNavegar("registro")}
            >
              Crear cuenta nueva
            </button>
          </p>
        </div>

        <footer className="panel-formulario__pie">
          <p>© 2026 FortiDev · Tecnológico de Antioquia</p>
          <nav aria-label="Pie autenticación">
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Soporte</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
