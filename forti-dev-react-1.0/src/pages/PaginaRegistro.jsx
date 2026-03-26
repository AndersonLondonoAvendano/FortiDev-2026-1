/**
 * PaginaRegistro.jsx
 * Página de registro de nuevos usuarios (registro.html).
 * Reemplaza: ValidarCamposVacios.js + MostrarOcultarContrasena.js
 *
 * - Validación de campos con estado local
 * - Indicador de fuerza de contraseña
 * - Toggle mostrar/ocultar contraseña
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MarcaLogo from "../components/shared/MarcaLogo.jsx";

const STATS_PANEL = [
  { color: "var(--color-critico)", titulo: "Hallazgos críticos",   desc: "Detección y seguimiento en tiempo real" },
  { color: "var(--color-acento)",  titulo: "Pruebas automatizadas", desc: "OWASP ZAP · SonarQube · Nessus" },
  { color: "var(--color-bajo)",    titulo: "Gestión colaborativa",  desc: "Equipos DevSec sincronizados" },
];

const NIVELES_LABELS  = ["", "Débil", "Regular", "Fuerte", "Muy fuerte"];
const NIVELES_CLASES  = ["", "--debil", "--regular", "--fuerte", "--muy-fuerte"];

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

  const handleContrasena = (v) => {
    setForm({ ...form, contrasena: v });
    setFuerza(calcularFuerza(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.nombre)    errs.nombre    = "Por favor ingresa tu nombre completo.";
    if (!form.email)     errs.email     = "Por favor ingresa tu correo electrónico.";
    if (!form.contrasena) errs.contrasena = "Por favor crea una contraseña.";
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    // TODO: reemplazar con fetch POST /api/auth/registro
    login(form.nombre.split(" ")[0]);
    navigate("/dashboard");
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
                  className="campo-input"
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                {errores.nombre && (
                  <span className="campo-error" role="alert">{errores.nombre}</span>
                )}
              </div>

              <div className="campo-grupo">
                <label className="campo-etiqueta" htmlFor="registro-rol">Rol</label>
                <select
                  id="registro-rol"
                  className="campo-input campo-select"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="dev">Desarrollador</option>
                  <option value="analista">Analista de seguridad</option>
                </select>
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
                  className="campo-input campo-input--con-icono"
                  placeholder="correo@empresa.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errores.email && (
                <span className="campo-error" role="alert">{errores.email}</span>
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
                  className="campo-input campo-input--con-icono"
                  placeholder="Mínimo 8 caracteres"
                  value={form.contrasena}
                  onChange={(e) => handleContrasena(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-toggle-contrasena"
                  onClick={() => setVerContrasena(!verContrasena)}
                >
                  <i className={`bi ${verContrasena ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>

              {/* Indicador de fuerza */}
              {form.contrasena && (
                <>
                  <div className="indicador-fuerza">
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
                <span className="campo-error" role="alert">{errores.contrasena}</span>
              )}
            </div>

            {/* Términos */}
            <label className="checkbox-personalizado">
              <input type="checkbox" required />
              <span className="checkbox-personalizado__indicador"></span>
              <span className="checkbox-personalizado__etiqueta">
                Acepto los{" "}
                <a href="#" className="enlace-interno">Términos de servicio</a> y la{" "}
                <a href="#" className="enlace-interno">Política de privacidad</a>
              </span>
            </label>

            <button
              className="btn btn--primario btn-registro"
              onClick={handleSubmit}
            >
              Crear cuenta
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
