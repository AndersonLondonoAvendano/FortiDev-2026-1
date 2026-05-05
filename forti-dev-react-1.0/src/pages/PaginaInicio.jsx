/**
 * PaginaInicio.jsx
 * Landing page pública (index.html).
 * Incluye: Header, Hero, Sección Problema, Funcionalidades, Contacto, Footer.
 * El menú hamburguesa reemplaza MenuHamburguesa.js con useState.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarcaLogo from "../components/shared/MarcaLogo.jsx";
import FormularioContacto from "../components/shared/FormularioContacto.jsx";

export default function PaginaInicio() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="pagina-inicio">
      {/* ── ENCABEZADO ── */}
      <header className="encabezado-principal" id="inicio">
        <div className="encabezado-principal__contenedor">
          <a href="#inicio" className="encabezado-principal__marca">
            <MarcaLogo />
          </a>

          <button
            className="encabezado-principal__hamburguesa"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            className={`encabezado-principal__nav${menuAbierto ? " menu-abierto" : ""}`}
            aria-label="Navegación principal"
          >
            <a href="#inicio"          className="nav-enlace">Inicio</a>
            <a href="#sobre-proyecto"  className="nav-enlace">Sobre el proyecto</a>
            <a href="#funcionalidades" className="nav-enlace">Funcionalidades</a>
            <a href="#contacto"        className="nav-enlace">Contacto</a>
          </nav>

          <div className="encabezado-principal__acciones">
            <button
              className="btn btn--secundario btn--sm"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
            <button
              className="btn btn--primario btn--sm"
              onClick={() => navigate("/registro")}
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="seccion-hero">
          <div className="seccion-hero__fondo-grid" aria-hidden="true"></div>

          <div className="seccion-hero__contenido">
            <div className="seccion-hero__eyebrow">
              <span className="indicador-activo" aria-hidden="true"></span>
              Penetration Testing as a Service
            </div>

            <h1 className="seccion-hero__titulo">
              Seguridad continua<br />
              integrada en tu<br />
              <span className="titulo-acento">flujo de desarrollo</span>
            </h1>

            <p className="seccion-hero__descripcion">
              FortiDev centraliza la gestión de vulnerabilidades, pruebas de
              penetración y hallazgos de seguridad en una sola plataforma
              colaborativa. Equipos de desarrollo y pentesters, unidos bajo un
              mismo panel de control.
            </p>

            <div className="seccion-hero__ctas">
              <button
                className="btn btn--primario btn--lg"
                onClick={() => navigate("/registro")}
              >
                Comenzar ahora
              </button>
              <a href="#sobre-proyecto" className="btn btn--secundario btn--lg">
                Ver documentación
              </a>
            </div>

            <div className="seccion-hero__stats">
              <div className="stat-item">
                <span className="stat-item__valor">PTaaS</span>
                <span className="stat-item__etiqueta">Modelo de servicio</span>
              </div>
              <div className="stat-separador" aria-hidden="true"></div>
              <div className="stat-item">
                <span className="stat-item__valor">3 Roles</span>
                <span className="stat-item__etiqueta">Admin · Dev · Analista</span>
              </div>
              <div className="stat-separador" aria-hidden="true"></div>
              <div className="stat-item">
                <span className="stat-item__valor">OWASP</span>
                <span className="stat-item__etiqueta">Integración nativa</span>
              </div>
            </div>
          </div>

          {/* Panel decorativo */}
          <div className="seccion-hero__panel-demo" aria-hidden="true">
            <div className="panel-demo__barra-superior">
              <span className="panel-demo__punto panel-demo__punto--rojo"></span>
              <span className="panel-demo__punto panel-demo__punto--amarillo"></span>
              <span className="panel-demo__punto panel-demo__punto--verde"></span>
              <span className="panel-demo__titulo-barra">dashboard · FortiDev</span>
            </div>
            <div className="panel-demo__cuerpo">
              <div className="panel-demo__metricas">
                {[
                  ["12", "Críticas", "critico"],
                  ["34", "Altas",    "alto"],
                  ["67", "Medias",   "medio"],
                  ["91", "Bajas",    "bajo"],
                ].map(([num, lbl, mod]) => (
                  <div key={mod} className={`demo-metrica demo-metrica--${mod}`}>
                    <span className="demo-metrica__num">{num}</span>
                    <span className="demo-metrica__lbl">{lbl}</span>
                  </div>
                ))}
              </div>
              <div className="panel-demo__filas">
                {[
                  ["critico", "C", "SQL Injection · Login endpoint",   "abierto",     "Abierto"],
                  ["alto",    "A", "XSS Reflejado · Panel admin",      "en-progreso", "En progreso"],
                  ["medio",   "M", "CSRF Token ausente · Formularios", "resuelto",    "Resuelto"],
                  ["bajo",    "B", "Headers HTTP inseguros",           "verificado",  "Verificado"],
                ].map(([sev, letra, nombre, estadoMod, estadoLabel]) => (
                  <div key={nombre} className="demo-fila">
                    <span className={`demo-fila__severidad demo-fila__severidad--${sev}`}>
                      {letra}
                    </span>
                    <span className="demo-fila__nombre">{nombre}</span>
                    <span className={`demo-fila__estado estado-badge estado-badge--${estadoMod}`}>
                      {estadoLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROBLEMA ── */}
        <section className="seccion-problema" id="sobre-proyecto">
          <div className="seccion-problema__contenedor">
            <div className="seccion-problema__encabezado">
              <span className="etiqueta-seccion">El problema</span>
              <h2 className="titulo-seccion">¿Qué resuelve FortiDev?</h2>
              <p className="descripcion-seccion">
                Las organizaciones modernas enfrentan brechas críticas entre
                equipos de desarrollo y seguridad. FortiDev cierra esa brecha
                con una solución centralizada y colaborativa.
              </p>
            </div>

            <div className="problema-grid">
              {[
                {
                  icono: "bi-exclamation-triangle",
                  color: "var(--color-critico)",
                  titulo: "Seguridad al final del ciclo",
                  texto: "Las pruebas de seguridad ocurren tarde, cuando corregir vulnerabilidades es costoso y riesgoso. FortiDev integra análisis desde el inicio del desarrollo.",
                },
                {
                  icono: "bi-file-earmark-text",
                  color: "var(--color-alto)",
                  titulo: "Reportes ininteligibles",
                  texto: "Los pentesters generan informes técnicos complejos que los desarrolladores no pueden accionar. FortiDev traduce hallazgos en tareas priorizadas.",
                },
                {
                  icono: "bi-link-45deg",
                  color: "var(--color-medio)",
                  titulo: "Equipos desconectados",
                  texto: "Sin canales claros entre analistas y desarrolladores, el seguimiento de vulnerabilidades se pierde. FortiDev crea un espacio común de trabajo.",
                },
              ].map(({ icono, color, titulo, texto }) => (
                <div className="problema-tarjeta" key={titulo}>
                  <div className="problema-tarjeta__icono" style={{ color }}>
                    <i className={`bi ${icono}`}></i>
                  </div>
                  <h3 className="problema-tarjeta__titulo">{titulo}</h3>
                  <p className="problema-tarjeta__texto">{texto}</p>
                </div>
              ))}
            </div>

            <div className="publico-objetivo">
              <h3 className="publico-objetivo__titulo">Dirigido a</h3>
              <div className="publico-objetivo__items">
                {[
                  { rol: "Pymes tecnológicas",     desc: "Sin equipo interno de seguridad pero con necesidad de pruebas continuas." },
                  { rol: "Equipos de desarrollo",  desc: "Desarrolladores que necesitan entender y resolver hallazgos de seguridad." },
                  { rol: "Analistas de seguridad", desc: "Pentesters que necesitan un sistema estructurado para reportar vulnerabilidades." },
                ].map(({ rol, desc }) => (
                  <div className="publico-item" key={rol}>
                    <span className="publico-item__rol">{rol}</span>
                    <p className="publico-item__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FUNCIONALIDADES ── */}
        <section className="seccion-funcionalidades" id="funcionalidades">
          <div className="seccion-funcionalidades__contenedor">
            <div className="seccion-funcionalidades__encabezado">
              <span className="etiqueta-seccion">Módulos del sistema</span>
              <h2 className="titulo-seccion">Funcionalidades principales</h2>
            </div>

            <div className="funcionalidades-grid">
              {/* Tarjeta destacada */}
              <div className="funcionalidad-tarjeta funcionalidad-tarjeta--destacada">
                <div className="funcionalidad-tarjeta__icono">
                  <i className="bi bi-person-badge"></i>
                </div>
                <h3 className="funcionalidad-tarjeta__titulo">
                  Gestión de usuarios y roles
                </h3>
                <p className="funcionalidad-tarjeta__texto">
                  Control de acceso basado en roles: Administrador, Desarrollador
                  y Analista de seguridad. Autenticación JWT + MFA para máxima
                  protección.
                </p>
                <ul className="funcionalidad-tarjeta__lista">
                  <li>Registro y autenticación segura</li>
                  <li>Asignación de permisos por proyecto</li>
                  <li>Auditoría de acciones de usuario</li>
                </ul>
              </div>

              {/* Tarjetas restantes */}
              {[
                { icono: "bi-folder2-open",   titulo: "Gestión de proyectos",    texto: "Organiza pruebas de seguridad por aplicación o entorno. Crea proyectos, asigna analistas y monitorea el avance en tiempo real." },
                { icono: "bi-radar",          titulo: "Escaneos automatizados",  texto: "Integración con OWASP ZAP, SonarQube y Nessus para detección automática de vulnerabilidades en aplicaciones web." },
                { icono: "bi-bug",            titulo: "Gestión de hallazgos",    texto: "Registro estructurado de vulnerabilidades con severidad, evidencia, descripción técnica y recomendaciones de remediación." },
                { icono: "bi-bar-chart-line", titulo: "Generación de reportes",  texto: "Reportes dinámicos con métricas, riesgos y priorización. Exportables para presentar a clientes, dirección o equipos técnicos." },
                { icono: "bi-bell",           titulo: "Alertas y notificaciones",texto: "Notificaciones en tiempo real sobre hallazgos críticos. Historial de vulnerabilidades y seguimiento del estado de corrección." },
              ].map(({ icono, titulo, texto }) => (
                <div className="funcionalidad-tarjeta" key={titulo}>
                  <div className="funcionalidad-tarjeta__icono">
                    <i className={`bi ${icono}`}></i>
                  </div>
                  <h3 className="funcionalidad-tarjeta__titulo">{titulo}</h3>
                  <p className="funcionalidad-tarjeta__texto">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <section className="seccion-contacto" id="contacto">
          <div className="seccion-contacto__contenedor">
            <div className="seccion-contacto__info">
              <span className="etiqueta-seccion">Proyecto académico</span>
              <h2 className="titulo-seccion">¿Tienes preguntas?</h2>
              <p className="descripcion-seccion">
                Este proyecto es desarrollado por estudiantes de Ingeniería en
                Software del Tecnológico de Antioquia.
              </p>
              <div className="contacto-datos">
                <p>Anderson Londoño Avendaño</p>
                <p>Xavier Rua Dominguez</p>
                <p>Santiago Suaza Cardona</p>
                <p className="contacto-datos__institucion">
                  Tecnológico de Antioquia — 2026
                </p>
              </div>
            </div>
            <FormularioContacto />
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="pie-pagina">
        <div className="pie-pagina__contenedor">
          <div className="pie-pagina__marca">
            <MarcaLogo />
          </div>
          <div className="pie-pagina__info">
            <p>Proyecto Pedagógico Integrador — Quinto Semestre</p>
            <p>Ingeniería en Software · Tecnológico de Antioquia · 2026</p>
            <p>Anderson Londoño Avendaño · Xavier Rua Dominguez · Santiago Suaza Cardona</p>
          </div>
          <nav className="pie-pagina__nav" aria-label="Pie de página">
            <a href="#inicio">Inicio</a>
            <button
              className="btn-reset nav-link-btn"
              onClick={() => navigate("/login")}
            >
              Acceder
            </button>
            <a href="#funcionalidades">Funcionalidades</a>
          </nav>
        </div>
        <div className="pie-pagina__barra-inferior">
          <p>© 2026 FortiDev · Plataforma PTaaS · Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}