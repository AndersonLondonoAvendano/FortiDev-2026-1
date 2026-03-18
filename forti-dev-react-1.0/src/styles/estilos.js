/**
 * estilos.js
 * Todos los CSS originales del proyecto consolidados en una cadena JS.
 * Se inyecta en el DOM desde App.jsx con <style dangerouslySetInnerHTML>.
 *
 * Archivos originales incluidos (en orden):
 *  1. base.css
 *  2. aplicacion.css
 *  3. dashboard.css
 *  4. autenticacion.css  +  registro-extra.css
 *  5. inicio.css
 *  6. proyectos.css
 *  7. reportes.css
 *  8. hallazgos.css
 */

const estilos = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

/* ══════════════════════════════════════════
   1. BASE.CSS
══════════════════════════════════════════ */
:root {
  --color-fondo:            #0d1117;
  --color-superficie:       #161b22;
  --color-superficie-alt:   #1c2128;
  --color-borde:            #30363d;
  --color-borde-sutil:      #21262d;
  --color-texto-primario:   #e6edf3;
  --color-texto-secundario: #8b949e;
  --color-texto-tenue:      #484f58;
  --color-acento:           #58a6ff;
  --color-acento-hover:     #79b8ff;
  --color-acento-fondo:     rgba(88, 166, 255, 0.10);
  --color-critico:          #f85149;
  --color-critico-fondo:    rgba(248, 81, 73, 0.12);
  --color-alto:             #e09b3d;
  --color-alto-fondo:       rgba(224, 155, 61, 0.12);
  --color-medio:            #e3b341;
  --color-medio-fondo:      rgba(227, 179, 65, 0.12);
  --color-bajo:             #3fb950;
  --color-bajo-fondo:       rgba(63, 185, 80, 0.12);
  --color-info:             #58a6ff;
  --color-info-fondo:       rgba(88, 166, 255, 0.12);
  --fuente-principal: 'IBM Plex Sans', sans-serif;
  --fuente-mono:      'IBM Plex Mono', monospace;
  --radio-borde:    6px;
  --radio-borde-lg: 10px;
  --sombra-sm: 0 1px 3px rgba(0,0,0,0.4);
  --sombra-md: 0 4px 12px rgba(0,0,0,0.5);
  --sombra-lg: 0 8px 32px rgba(0,0,0,0.6);
  --ancho-sidebar: 240px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; scroll-behavior: smooth; }
body {
  background-color: var(--color-fondo);
  color: var(--color-texto-primario);
  font-family: var(--fuente-principal);
  font-size: 0.9375rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-acento); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--color-acento-hover); }
ul, ol { list-style: none; }
img { max-width: 100%; display: block; }

.btn-reset {
  background: none; border: none; cursor: pointer;
  padding: 0; font: inherit; color: inherit; text-align: left;
}
.nav-link-btn { color: var(--color-texto-tenue); font-size: 0.825rem; transition: color 0.2s; }
.nav-link-btn:hover { color: var(--color-texto-primario); }
.enlace-ver-todos { font-size: 0.8rem; color: var(--color-acento); background: none; border: none; cursor: pointer; }

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); border: 0;
}

.etiqueta-severidad {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 4px;
  font-family: var(--fuente-mono); font-size: 0.75rem;
  font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
}
.etiqueta-severidad--critico { background: var(--color-critico-fondo); color: var(--color-critico); }
.etiqueta-severidad--alto    { background: var(--color-alto-fondo);    color: var(--color-alto); }
.etiqueta-severidad--medio   { background: var(--color-medio-fondo);   color: var(--color-medio); }
.etiqueta-severidad--bajo    { background: var(--color-bajo-fondo);    color: var(--color-bajo); }

.estado-badge {
  display: inline-block; padding: 2px 10px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
}
.estado-badge--abierto     { background: var(--color-critico-fondo); color: var(--color-critico); }
.estado-badge--en-progreso { background: var(--color-medio-fondo);   color: var(--color-medio); }
.estado-badge--resuelto    { background: var(--color-bajo-fondo);    color: var(--color-bajo); }
.estado-badge--verificado  { background: var(--color-info-fondo);    color: var(--color-info); }

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border: 1px solid transparent;
  border-radius: var(--radio-borde); font-family: var(--fuente-principal);
  font-size: 0.875rem; font-weight: 500; cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
  white-space: nowrap; text-decoration: none;
}
.btn--primario   { background: var(--color-acento); color: #0d1117; border-color: var(--color-acento); }
.btn--primario:hover { background: var(--color-acento-hover); border-color: var(--color-acento-hover); color: #0d1117; box-shadow: 0 0 0 3px rgba(88,166,255,0.2); }
.btn--secundario { background: transparent; color: var(--color-texto-primario); border-color: var(--color-borde); }
.btn--secundario:hover { background: var(--color-superficie-alt); border-color: var(--color-texto-secundario); }
.btn--peligro    { background: transparent; color: var(--color-critico); border-color: var(--color-critico); }
.btn--peligro:hover { background: var(--color-critico-fondo); box-shadow: 0 0 0 3px rgba(248,81,73,0.15); }
.btn--sm { padding: 5px 12px; font-size: 0.8rem; }
.btn--lg { padding: 12px 28px; font-size: 1rem; }

.campo-input {
  width: 100%; background: var(--color-superficie-alt);
  border: 1px solid var(--color-borde); border-radius: var(--radio-borde);
  color: var(--color-texto-primario); font-family: var(--fuente-principal);
  font-size: 0.9rem; padding: 10px 14px;
  transition: border-color 0.2s, box-shadow 0.2s; outline: none;
}
.campo-input:focus { border-color: var(--color-acento); box-shadow: 0 0 0 3px rgba(88,166,255,0.15); }
.campo-input::placeholder { color: var(--color-texto-tenue); }

.tarjeta {
  background: var(--color-superficie); border: 1px solid var(--color-borde-sutil);
  border-radius: var(--radio-borde-lg); padding: 20px 24px;
}

/* ══════════════════════════════════════════
   2. APLICACION.CSS
══════════════════════════════════════════ */
.pagina-aplicacion {
  display: grid;
  grid-template-columns: var(--ancho-sidebar) 1fr;
  grid-template-rows: 52px 1fr;
  grid-template-areas: "barra-lateral barra-superior" "barra-lateral contenido-principal";
  min-height: 100vh;
}
.barra-lateral {
  grid-area: barra-lateral; background: var(--color-superficie);
  border-right: 1px solid var(--color-borde-sutil);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto; overflow-x: hidden; z-index: 50;
}
.barra-lateral::-webkit-scrollbar { width: 4px; }
.barra-lateral::-webkit-scrollbar-track { background: transparent; }
.barra-lateral::-webkit-scrollbar-thumb { background: var(--color-borde); border-radius: 4px; }
.barra-lateral__marca {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 16px 14px; border-bottom: 1px solid var(--color-borde-sutil);
  text-decoration: none; flex-shrink: 0;
}
.barra-lateral__marca .marca-nombre { font-size: 1rem; color: var(--color-texto-primario); }
.barra-lateral__selector-org {
  margin: 12px 10px; background: var(--color-superficie-alt);
  border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde);
  padding: 10px 12px; display: flex; align-items: center;
  gap: 10px; cursor: pointer; transition: border-color 0.2s;
}
.barra-lateral__selector-org:hover { border-color: var(--color-borde); }
.selector-org__avatar {
  width: 26px; height: 26px; background: var(--color-acento-fondo);
  border: 1px solid rgba(88,166,255,0.3); border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--fuente-mono); font-size: 0.7rem; font-weight: 700;
  color: var(--color-acento); flex-shrink: 0;
}
.selector-org__info { flex: 1; overflow: hidden; }
.selector-org__nombre { font-size: 0.825rem; font-weight: 600; color: var(--color-texto-primario); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.selector-org__tipo { font-size: 0.7rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }
.selector-org__chevron { color: var(--color-texto-tenue); font-size: 0.6rem; flex-shrink: 0; }
.barra-lateral__nav { flex: 1; padding: 8px 0; overflow-y: auto; }
.nav-seccion { margin-bottom: 16px; }
.nav-seccion__etiqueta {
  font-family: var(--fuente-mono); font-size: 0.65rem; color: var(--color-texto-tenue);
  text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 16px 4px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; margin: 1px 8px; border-radius: var(--radio-borde);
  font-size: 0.875rem; color: var(--color-texto-secundario);
  text-decoration: none; transition: background 0.15s, color 0.15s;
  position: relative; width: calc(100% - 16px);
}
.nav-item:hover { background: var(--color-superficie-alt); color: var(--color-texto-primario); }
.nav-item--activo { background: var(--color-acento-fondo); color: var(--color-acento); border: 1px solid rgba(88,166,255,0.15); }
.nav-item--activo:hover { background: var(--color-acento-fondo); color: var(--color-acento); }
.nav-item__icono { font-size: 0.95rem; width: 20px; text-align: center; flex-shrink: 0; }
.nav-item__texto { flex: 1; }
.nav-item__badge {
  background: var(--color-critico-fondo); color: var(--color-critico);
  border-radius: 20px; font-family: var(--fuente-mono); font-size: 0.65rem;
  font-weight: 700; padding: 1px 7px; min-width: 20px; text-align: center;
}
.barra-lateral__usuario { padding: 12px 10px; border-top: 1px solid var(--color-borde-sutil); flex-shrink: 0; }
.usuario-perfil {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 8px; border-radius: var(--radio-borde);
  cursor: pointer; transition: background 0.15s;
}
.usuario-perfil:hover { background: var(--color-superficie-alt); }
.usuario-perfil__avatar {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, var(--color-acento), #1f6feb);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0;
}
.usuario-perfil__info { flex: 1; overflow: hidden; }
.usuario-perfil__nombre { font-size: 0.825rem; font-weight: 600; color: var(--color-texto-primario); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.usuario-perfil__rol { font-size: 0.7rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }
.usuario-perfil__opciones { color: var(--color-texto-tenue); font-size: 0.7rem; }

.barra-superior {
  grid-area: barra-superior; background: var(--color-superficie);
  border-bottom: 1px solid var(--color-borde-sutil); height: 52px;
  display: flex; align-items: center; gap: 16px; padding: 0 24px;
  position: sticky; top: 0; z-index: 40;
}
.barra-superior__titulo-pagina { flex: 1; display: flex; align-items: center; gap: 8px; }
.titulo-pagina__breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--color-texto-tenue); }
.titulo-pagina__breadcrumb .separador { color: var(--color-texto-tenue); }
.titulo-pagina__actual { font-size: 0.875rem; font-weight: 600; color: var(--color-texto-primario); }
.barra-superior__busqueda {
  display: flex; align-items: center; gap: 8px;
  background: var(--color-superficie-alt); border: 1px solid var(--color-borde-sutil);
  border-radius: var(--radio-borde); padding: 6px 12px; width: 260px; transition: border-color 0.2s;
}
.barra-superior__busqueda:focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px rgba(88,166,255,0.1); }
.busqueda__icono { color: var(--color-texto-tenue); font-size: 0.85rem; }
.busqueda__input { background: none; border: none; color: var(--color-texto-primario); font-family: var(--fuente-principal); font-size: 0.85rem; outline: none; flex: 1; min-width: 0; }
.busqueda__input::placeholder { color: var(--color-texto-tenue); }
.busqueda__atajo { font-family: var(--fuente-mono); font-size: 0.65rem; color: var(--color-texto-tenue); background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: 4px; padding: 1px 5px; }
.barra-superior__acciones { display: flex; align-items: center; gap: 8px; }
.btn-topbar {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  background: none; border: 1px solid transparent; border-radius: var(--radio-borde);
  color: var(--color-texto-secundario); cursor: pointer; font-size: 1rem;
  transition: background 0.15s, border-color 0.15s, color 0.15s; position: relative;
}
.btn-topbar:hover { background: var(--color-superficie-alt); border-color: var(--color-borde-sutil); color: var(--color-texto-primario); }
.btn-topbar__punto-notificacion {
  position: absolute; top: 5px; right: 5px; width: 7px; height: 7px;
  background: var(--color-critico); border-radius: 50%; border: 2px solid var(--color-superficie);
}
.contenido-principal { grid-area: contenido-principal; background: var(--color-fondo); overflow-y: auto; padding: 28px 32px; }
.encabezado-pagina { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.encabezado-pagina__titulo { font-size: 1.4rem; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 4px; }
.encabezado-pagina__descripcion { font-size: 0.875rem; color: var(--color-texto-secundario); }
.encabezado-pagina__acciones { display: flex; gap: 10px; flex-shrink: 0; }
.tabs-navegacion { display: flex; gap: 0; border-bottom: 1px solid var(--color-borde-sutil); margin-bottom: 24px; }
.tab-item {
  padding: 10px 18px; font-size: 0.875rem; color: var(--color-texto-secundario);
  cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s; background: none;
  border-top: none; border-left: none; border-right: none;
  display: flex; align-items: center; gap: 6px; text-decoration: none;
}
.tab-item:hover { color: var(--color-texto-primario); }
.tab-item--activo { color: var(--color-texto-primario); border-bottom-color: var(--color-acento); font-weight: 500; }
.tab-item__conteo {
  background: var(--color-superficie-alt); border: 1px solid var(--color-borde);
  border-radius: 20px; font-family: var(--fuente-mono); font-size: 0.68rem; padding: 0 6px; color: var(--color-texto-tenue);
}

/* ══════════════════════════════════════════
   3. DASHBOARD.CSS
══════════════════════════════════════════ */
.seccion-kpi { margin-bottom: 24px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.tarjeta-kpi {
  background: var(--color-superficie); border: 1px solid var(--color-borde-sutil);
  border-radius: var(--radio-borde-lg); padding: 20px 22px; position: relative;
  overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s;
}
.tarjeta-kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: var(--radio-borde-lg) var(--radio-borde-lg) 0 0; }
.tarjeta-kpi--critico::before { background: var(--color-critico); }
.tarjeta-kpi--alto::before    { background: var(--color-alto); }
.tarjeta-kpi--medio::before   { background: var(--color-medio); }
.tarjeta-kpi--bajo::before    { background: var(--color-bajo); }
.tarjeta-kpi:hover { border-color: var(--color-borde); box-shadow: var(--sombra-md); }
.tarjeta-kpi__encabezado { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.tarjeta-kpi__icono { font-size: 0.5rem; }
.tarjeta-kpi--critico .tarjeta-kpi__icono { color: var(--color-critico); }
.tarjeta-kpi--alto    .tarjeta-kpi__icono { color: var(--color-alto); }
.tarjeta-kpi--medio   .tarjeta-kpi__icono { color: var(--color-medio); }
.tarjeta-kpi--bajo    .tarjeta-kpi__icono { color: var(--color-bajo); }
.tarjeta-kpi__etiqueta { font-family: var(--fuente-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
.tarjeta-kpi--critico .tarjeta-kpi__etiqueta { color: var(--color-critico); }
.tarjeta-kpi--alto    .tarjeta-kpi__etiqueta { color: var(--color-alto); }
.tarjeta-kpi--medio   .tarjeta-kpi__etiqueta { color: var(--color-medio); }
.tarjeta-kpi--bajo    .tarjeta-kpi__etiqueta { color: var(--color-bajo); }
.tarjeta-kpi__valor { font-family: var(--fuente-mono); font-size: 2.8rem; font-weight: 700; line-height: 1; margin-bottom: 10px; letter-spacing: -0.03em; }
.tarjeta-kpi--critico .tarjeta-kpi__valor { color: var(--color-critico); }
.tarjeta-kpi--alto    .tarjeta-kpi__valor { color: var(--color-alto); }
.tarjeta-kpi--medio   .tarjeta-kpi__valor { color: var(--color-medio); }
.tarjeta-kpi--bajo    .tarjeta-kpi__valor { color: var(--color-bajo); }
.tarjeta-kpi__pie { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.tarjeta-kpi__variacion { font-family: var(--fuente-mono); font-size: 0.72rem; font-weight: 600; }
.tarjeta-kpi__variacion--subida { color: var(--color-critico); }
.tarjeta-kpi__variacion--bajada { color: var(--color-bajo); }
.tarjeta-kpi__variacion--neutro { color: var(--color-texto-tenue); }
.tarjeta-kpi__periodo { font-size: 0.7rem; color: var(--color-texto-tenue); }
.tarjeta-kpi__barra-progreso { height: 4px; background: var(--color-borde-sutil); border-radius: 2px; overflow: hidden; }
.tarjeta-kpi__barra-relleno { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.tarjeta-kpi--critico .tarjeta-kpi__barra-relleno { background: var(--color-critico); }
.tarjeta-kpi--alto    .tarjeta-kpi__barra-relleno { background: var(--color-alto); }
.tarjeta-kpi--medio   .tarjeta-kpi__barra-relleno { background: var(--color-medio); }
.tarjeta-kpi--bajo    .tarjeta-kpi__barra-relleno { background: var(--color-bajo); }

.fila-metricas-secundarias { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; margin-bottom: 24px; }
.tarjeta-grafico-estado { display: flex; flex-direction: column; gap: 16px; }
.tarjeta-grafico-estado__encabezado { display: flex; align-items: center; justify-content: space-between; }
.grafico-dona-placeholder { display: flex; justify-content: center; align-items: center; padding: 8px 0; }
.dona__anillo {
  width: 120px; height: 120px; border-radius: 50%;
  background: conic-gradient(var(--color-critico) 0deg 158deg, var(--color-medio) 158deg 241deg, var(--color-bajo) 241deg 360deg);
  display: flex; align-items: center; justify-content: center; position: relative;
}
.dona__anillo::before { content: ''; position: absolute; inset: 24px; background: var(--color-superficie); border-radius: 50%; }
.dona__texto-centro { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
.dona__num { font-family: var(--fuente-mono); font-size: 1.4rem; font-weight: 700; line-height: 1; }
.dona__lbl { font-size: 0.65rem; color: var(--color-texto-tenue); text-transform: uppercase; letter-spacing: 0.06em; }
.leyenda-estado { display: flex; flex-direction: column; gap: 8px; }
.leyenda-item { display: flex; align-items: center; gap: 8px; font-size: 0.825rem; }
.leyenda-item__punto { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.leyenda-item__texto { flex: 1; color: var(--color-texto-secundario); }
.leyenda-item__valor { font-family: var(--fuente-mono); font-size: 0.825rem; font-weight: 600; }

.tarjeta-actividad { display: flex; flex-direction: column; gap: 0; }
.tarjeta-actividad__encabezado { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.lista-actividad { display: flex; flex-direction: column; }
.actividad-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--color-borde-sutil); }
.actividad-item:last-child { border-bottom: none; }
.actividad-item__icono-wrapper { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; flex-shrink: 0; }
.actividad-item__icono-wrapper--critico { background: var(--color-critico-fondo); color: var(--color-critico); }
.actividad-item__icono-wrapper--resuelto { background: var(--color-bajo-fondo);   color: var(--color-bajo); }
.actividad-item__icono-wrapper--alto     { background: var(--color-alto-fondo);   color: var(--color-alto); }
.actividad-item__icono-wrapper--info     { background: var(--color-info-fondo);   color: var(--color-info); }
.actividad-item__contenido { flex: 1; min-width: 0; }
.actividad-item__texto { font-size: 0.84rem; color: var(--color-texto-secundario); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.actividad-item__texto strong { color: var(--color-texto-primario); }
.actividad-item__texto em { color: var(--color-acento); font-style: normal; }
.actividad-item__tiempo { font-family: var(--fuente-mono); font-size: 0.7rem; color: var(--color-texto-tenue); }

.seccion-tabla-hallazgos { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); overflow: hidden; }
.seccion-tabla-hallazgos__encabezado { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 20px 24px; border-bottom: 1px solid var(--color-borde-sutil); }
.titulo-tarjeta { font-size: 1rem; font-weight: 600; margin-bottom: 2px; }
.subtitulo-tarjeta { font-size: 0.8rem; color: var(--color-texto-secundario); }
.contenedor-tabla-scroll { overflow-x: auto; }
.tabla-datos { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.tabla-datos thead tr { border-bottom: 1px solid var(--color-borde-sutil); }
.tabla-datos th { padding: 10px 14px; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--color-texto-tenue); font-family: var(--fuente-mono); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; background: var(--color-superficie-alt); }
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: var(--color-texto-secundario); }
.th-check, .th-acciones { width: 40px; }
.tabla-datos tbody tr { border-bottom: 1px solid var(--color-borde-sutil); }
.tabla-datos tbody tr:last-child { border-bottom: none; }
.fila-hallazgo { transition: background 0.15s; }
.fila-hallazgo:hover { background: var(--color-superficie-alt); cursor: pointer; }
.tabla-datos td { padding: 11px 14px; vertical-align: middle; }
.celda-nombre-hallazgo { display: flex; align-items: center; gap: 10px; font-weight: 500; min-width: 280px; }
.hallazgo-id { font-family: var(--fuente-mono); font-size: 0.72rem; color: var(--color-texto-tenue); background: var(--color-superficie-alt); border: 1px solid var(--color-borde-sutil); border-radius: 4px; padding: 1px 6px; white-space: nowrap; flex-shrink: 0; }
.celda-proyecto { font-size: 0.84rem; color: var(--color-texto-secundario); white-space: nowrap; }
.celda-score { font-family: var(--fuente-mono); font-size: 0.875rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
.celda-score--critico { color: var(--color-critico); background: var(--color-critico-fondo); }
.celda-score--alto    { color: var(--color-alto);    background: var(--color-alto-fondo); }
.celda-score--medio   { color: var(--color-medio);   background: var(--color-medio-fondo); }
.celda-score--bajo    { color: var(--color-bajo);    background: var(--color-bajo-fondo); }
.celda-fecha { font-family: var(--fuente-mono); font-size: 0.8rem; color: var(--color-texto-tenue); white-space: nowrap; }
.celda-asignado { text-align: center; }
.avatar-usuario-mini { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #1f6feb, var(--color-acento)); font-size: 0.65rem; font-weight: 700; color: #fff; cursor: default; }
.celda-acciones { text-align: right; }
.btn-accion-fila { background: none; border: 1px solid transparent; border-radius: var(--radio-borde); color: var(--color-texto-tenue); cursor: pointer; font-size: 0.9rem; padding: 4px 10px; transition: color 0.15s, border-color 0.15s, background 0.15s; }
.btn-accion-fila:hover { color: var(--color-acento); border-color: rgba(88,166,255,0.3); background: var(--color-acento-fondo); }
.checkbox-tabla { width: 15px; height: 15px; accent-color: var(--color-acento); cursor: pointer; }
.tabla-pie { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-top: 1px solid var(--color-borde-sutil); background: var(--color-superficie-alt); gap: 16px; }
.tabla-pie__info { font-size: 0.8rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); white-space: nowrap; }
.paginacion { display: flex; align-items: center; gap: 4px; }
.btn-paginacion { min-width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde); color: var(--color-texto-secundario); font-size: 0.8rem; cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s; font-family: var(--fuente-mono); padding: 0 8px; }
.btn-paginacion:hover:not(:disabled) { background: var(--color-superficie-alt); border-color: var(--color-borde); color: var(--color-texto-primario); }
.btn-paginacion:disabled { opacity: 0.3; cursor: not-allowed; }
.btn-paginacion--activo { background: var(--color-acento-fondo); border-color: rgba(88,166,255,0.3); color: var(--color-acento); font-weight: 600; }
.paginacion__puntos { color: var(--color-texto-tenue); font-size: 0.8rem; padding: 0 4px; }
.selector-filas-pagina { background: var(--color-superficie-alt); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde); color: var(--color-texto-secundario); font-family: var(--fuente-mono); font-size: 0.78rem; padding: 6px 10px; cursor: pointer; }

/* ══════════════════════════════════════════
   4. AUTENTICACION.CSS + REGISTRO-EXTRA.CSS
══════════════════════════════════════════ */
.pagina-autenticacion { background: var(--color-fondo); min-height: 100vh; }
.contenedor-autenticacion { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
.panel-info-sistema { background: var(--color-superficie); border-right: 1px solid var(--color-borde-sutil); position: relative; overflow: hidden; }
.panel-info-sistema__contenido { display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 60px 56px; position: relative; z-index: 1; }
.panel-info-sistema__cita { font-size: 1.1rem; font-weight: 300; line-height: 1.75; color: var(--color-texto-secundario); border-left: 3px solid var(--color-acento); padding-left: 20px; margin-bottom: 40px; font-style: italic; }
.panel-info-sistema__stats { display: flex; flex-direction: column; gap: 20px; }
.panel-stat { display: flex; align-items: flex-start; gap: 14px; }
.panel-stat__icono { font-size: 0.6rem; margin-top: 7px; flex-shrink: 0; }
.panel-stat__titulo { font-size: 0.9rem; font-weight: 600; color: var(--color-texto-primario); margin-bottom: 2px; }
.panel-stat__desc { font-size: 0.8rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }
.panel-info-sistema__fondo-decorativo { position: absolute; bottom: -80px; right: -80px; pointer-events: none; z-index: 0; }
.deco-hexagono { width: 320px; height: 320px; border: 1px solid rgba(88,166,255,0.07); border-radius: 50%; box-shadow: inset 0 0 80px rgba(88,166,255,0.04), 0 0 80px rgba(88,166,255,0.03); }
.deco-hexagono::before { content: ''; position: absolute; inset: 40px; border: 1px solid rgba(88,166,255,0.06); border-radius: 50%; }
.deco-hexagono::after  { content: ''; position: absolute; inset: 80px; border: 1px solid rgba(88,166,255,0.05); border-radius: 50%; }
.panel-formulario { display: flex; flex-direction: column; justify-content: space-between; padding: 40px; overflow-y: auto; }
.formulario-acceso__contenedor, .formulario-registro__contenedor { max-width: 420px; width: 100%; margin: auto; padding: 20px 0; }
.formulario-acceso__encabezado, .formulario-registro__encabezado { margin-bottom: 32px; }
.formulario-acceso__titulo, .formulario-registro__titulo { font-size: 1.75rem; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.formulario-acceso__subtitulo, .formulario-registro__subtitulo { font-size: 0.9rem; color: var(--color-texto-secundario); line-height: 1.6; }
.formulario-acceso, .formulario-registro { display: flex; flex-direction: column; gap: 18px; }
.campo-grupo { display: flex; flex-direction: column; gap: 6px; }
.campo-etiqueta { font-size: 0.825rem; font-weight: 500; color: var(--color-texto-secundario); }
.campo-input-wrapper { position: relative; display: flex; align-items: center; }
.campo-input-icono { position: absolute; left: 12px; color: var(--color-texto-tenue); font-size: 0.9rem; pointer-events: none; z-index: 1; }
.campo-input--con-icono { padding-left: 38px; }
.btn-toggle-contrasena { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: var(--color-texto-tenue); font-size: 0.9rem; padding: 4px; transition: color 0.2s; }
.btn-toggle-contrasena:hover { color: var(--color-texto-secundario); }
.campo-error { font-size: 0.78rem; color: var(--color-critico); min-height: 16px; font-family: var(--fuente-mono); }
.campo-grupo--horizontal { flex-direction: row; align-items: center; justify-content: space-between; }
.checkbox-personalizado { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.checkbox-personalizado input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }
.checkbox-personalizado__indicador { width: 16px; height: 16px; border: 1px solid var(--color-borde); border-radius: 4px; background: var(--color-superficie-alt); transition: border-color 0.2s, background 0.2s; flex-shrink: 0; position: relative; }
.checkbox-personalizado input:checked + .checkbox-personalizado__indicador { background: var(--color-acento); border-color: var(--color-acento); }
.checkbox-personalizado input:checked + .checkbox-personalizado__indicador::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #0d1117; font-size: 0.65rem; font-weight: 700; }
.checkbox-personalizado__etiqueta { font-size: 0.825rem; color: var(--color-texto-secundario); user-select: none; }
.enlace-recuperar { font-size: 0.825rem; color: var(--color-acento); }
.btn-acceso, .btn-registro { width: 100%; justify-content: center; padding: 11px 20px; font-size: 0.9375rem; margin-top: 4px; }
.alerta-formulario { background: var(--color-critico-fondo); border: 1px solid rgba(248,81,73,0.3); border-radius: var(--radio-borde); padding: 10px 14px; font-size: 0.85rem; color: var(--color-critico); display: flex; align-items: center; gap: 8px; }
.formulario-acceso__separador, .formulario-registro__separador { display: flex; align-items: center; gap: 12px; color: var(--color-texto-tenue); font-size: 0.8rem; margin: 4px 0; }
.formulario-acceso__separador::before, .formulario-acceso__separador::after,
.formulario-registro__separador::before, .formulario-registro__separador::after { content: ''; flex: 1; height: 1px; background: var(--color-borde-sutil); }
.opciones-oauth { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-oauth { justify-content: center; gap: 8px; font-size: 0.875rem; }
.formulario-acceso__registro, .formulario-registro__login { text-align: center; font-size: 0.85rem; color: var(--color-texto-secundario); margin-top: 8px; }
.enlace-interno { color: var(--color-acento); font-weight: 500; background: none; border: none; cursor: pointer; font: inherit; }
.enlace-interno:hover { color: var(--color-acento-hover); }
.panel-formulario__pie { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--color-borde-sutil); margin-top: 20px; }
.panel-formulario__pie p, .panel-formulario__pie a { font-size: 0.75rem; color: var(--color-texto-tenue); }
.panel-formulario__pie nav { display: flex; gap: 16px; }
.panel-formulario__pie a:hover { color: var(--color-texto-secundario); }
.indicador-fuerza { display: flex; gap: 4px; margin-top: 4px; }
.indicador-fuerza__barra { flex: 1; height: 3px; background: var(--color-borde); border-radius: 2px; transition: background 0.3s; }
.indicador-fuerza__barra--debil     { background: var(--color-critico); }
.indicador-fuerza__barra--regular   { background: var(--color-alto); }
.indicador-fuerza__barra--fuerte    { background: var(--color-medio); }
.indicador-fuerza__barra--muy-fuerte { background: var(--color-bajo); }
.indicador-fuerza__texto { font-size: 0.75rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); margin-top: 4px; }
.registro-fila-doble { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.campo-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238b949e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px; cursor: pointer; }

/* ══════════════════════════════════════════
   5. INICIO.CSS
══════════════════════════════════════════ */
.pagina-inicio { min-height: 100vh; }
.encabezado-principal { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(13,17,23,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-borde-sutil); height: 60px; }
.encabezado-principal__contenedor { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 100%; display: flex; align-items: center; gap: 32px; }
.encabezado-principal__marca { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.marca-icono { font-size: 1.4rem; color: var(--color-acento); line-height: 1; }
.marca-nombre { font-size: 1.1rem; font-weight: 300; color: var(--color-texto-primario); letter-spacing: -0.01em; }
.marca-nombre strong { font-weight: 700; color: var(--color-acento); }
.marca-etiqueta { font-family: var(--fuente-mono); font-size: 0.65rem; color: var(--color-texto-tenue); background: var(--color-superficie-alt); border: 1px solid var(--color-borde); border-radius: 4px; padding: 1px 6px; letter-spacing: 0.08em; text-transform: uppercase; }
.encabezado-principal__nav { display: flex; align-items: center; gap: 4px; flex: 1; }
.nav-enlace { padding: 6px 12px; border-radius: var(--radio-borde); font-size: 0.875rem; color: var(--color-texto-secundario); transition: color 0.2s, background 0.2s; }
.nav-enlace:hover { color: var(--color-texto-primario); background: var(--color-superficie-alt); }
.encabezado-principal__acciones { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.encabezado-principal__hamburguesa { display: none; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; margin-left: auto; }
.encabezado-principal__hamburguesa span { display: block; width: 22px; height: 2px; background: var(--color-texto-secundario); border-radius: 2px; transition: transform 0.2s, opacity 0.2s; }
.seccion-hero { position: relative; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 48px; max-width: 1280px; margin: 0 auto; padding: 100px 24px 60px; overflow: hidden; }
.seccion-hero__fondo-grid { position: fixed; inset: 0; pointer-events: none; z-index: -1; background-image: linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 80%); }
.seccion-hero__contenido { display: flex; flex-direction: column; gap: 24px; }
.seccion-hero__eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--fuente-mono); font-size: 0.78rem; color: var(--color-texto-secundario); letter-spacing: 0.08em; text-transform: uppercase; }
.indicador-activo { display: inline-block; width: 8px; height: 8px; background: var(--color-bajo); border-radius: 50%; box-shadow: 0 0 8px var(--color-bajo); animation: pulso-activo 2s ease-in-out infinite; }
@keyframes pulso-activo { 0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--color-bajo); } 50% { opacity: 0.6; box-shadow: 0 0 16px var(--color-bajo); } }
.seccion-hero__titulo { font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; color: var(--color-texto-primario); }
.titulo-acento { color: var(--color-acento); position: relative; }
.titulo-acento::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--color-acento), transparent); border-radius: 2px; }
.seccion-hero__descripcion { font-size: 1.05rem; line-height: 1.75; color: var(--color-texto-secundario); max-width: 540px; }
.seccion-hero__ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.seccion-hero__stats { display: flex; align-items: center; gap: 24px; padding-top: 12px; border-top: 1px solid var(--color-borde-sutil); margin-top: 8px; }
.stat-item { display: flex; flex-direction: column; gap: 2px; }
.stat-item__valor { font-family: var(--fuente-mono); font-size: 1rem; font-weight: 600; color: var(--color-texto-primario); }
.stat-item__etiqueta { font-size: 0.72rem; color: var(--color-texto-tenue); letter-spacing: 0.04em; }
.stat-separador { width: 1px; height: 32px; background: var(--color-borde); }
.seccion-hero__panel-demo { background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-borde-lg); box-shadow: var(--sombra-lg), 0 0 60px rgba(88,166,255,0.05); overflow: hidden; animation: flotar 4s ease-in-out infinite; }
@keyframes flotar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.panel-demo__barra-superior { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: var(--color-superficie-alt); border-bottom: 1px solid var(--color-borde-sutil); }
.panel-demo__punto { width: 12px; height: 12px; border-radius: 50%; }
.panel-demo__punto--rojo    { background: #f85149; }
.panel-demo__punto--amarillo { background: #e3b341; }
.panel-demo__punto--verde   { background: #3fb950; }
.panel-demo__titulo-barra { font-family: var(--fuente-mono); font-size: 0.72rem; color: var(--color-texto-tenue); margin-left: 8px; }
.panel-demo__cuerpo { padding: 16px; }
.panel-demo__metricas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
.demo-metrica { display: flex; flex-direction: column; align-items: center; padding: 12px 8px; border-radius: var(--radio-borde); border: 1px solid transparent; }
.demo-metrica--critico { background: var(--color-critico-fondo); border-color: rgba(248,81,73,0.2); }
.demo-metrica--alto    { background: var(--color-alto-fondo);    border-color: rgba(224,155,61,0.2); }
.demo-metrica--medio   { background: var(--color-medio-fondo);   border-color: rgba(227,179,65,0.2); }
.demo-metrica--bajo    { background: var(--color-bajo-fondo);    border-color: rgba(63,185,80,0.2); }
.demo-metrica__num { font-family: var(--fuente-mono); font-size: 1.4rem; font-weight: 600; line-height: 1; }
.demo-metrica--critico .demo-metrica__num { color: var(--color-critico); }
.demo-metrica--alto    .demo-metrica__num { color: var(--color-alto); }
.demo-metrica--medio   .demo-metrica__num { color: var(--color-medio); }
.demo-metrica--bajo    .demo-metrica__num { color: var(--color-bajo); }
.demo-metrica__lbl { font-size: 0.68rem; color: var(--color-texto-secundario); margin-top: 4px; }
.panel-demo__filas { display: flex; flex-direction: column; gap: 6px; }
.demo-fila { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--color-superficie-alt); border-radius: var(--radio-borde); border: 1px solid var(--color-borde-sutil); font-size: 0.8rem; }
.demo-fila__severidad { width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: var(--fuente-mono); font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
.demo-fila__severidad--critico { background: var(--color-critico-fondo); color: var(--color-critico); }
.demo-fila__severidad--alto    { background: var(--color-alto-fondo);    color: var(--color-alto); }
.demo-fila__severidad--medio   { background: var(--color-medio-fondo);   color: var(--color-medio); }
.demo-fila__severidad--bajo    { background: var(--color-bajo-fondo);    color: var(--color-bajo); }
.demo-fila__nombre { flex: 1; color: var(--color-texto-secundario); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.seccion-problema, .seccion-funcionalidades, .seccion-contacto { padding: 80px 0; border-top: 1px solid var(--color-borde-sutil); }
.seccion-problema__contenedor, .seccion-funcionalidades__contenedor, .seccion-contacto__contenedor { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.seccion-problema__encabezado, .seccion-funcionalidades__encabezado { text-align: center; margin-bottom: 48px; }
.etiqueta-seccion { display: inline-block; font-family: var(--fuente-mono); font-size: 0.72rem; color: var(--color-acento); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; border: 1px solid rgba(88,166,255,0.3); border-radius: 20px; padding: 3px 12px; background: var(--color-acento-fondo); }
.titulo-seccion { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; letter-spacing: -0.02em; margin-bottom: 14px; }
.descripcion-seccion { font-size: 1rem; color: var(--color-texto-secundario); max-width: 600px; margin: 0 auto; line-height: 1.75; }
.problema-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
.problema-tarjeta { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 28px 24px; transition: border-color 0.2s, transform 0.2s; }
.problema-tarjeta:hover { border-color: var(--color-borde); transform: translateY(-3px); }
.problema-tarjeta__icono { font-size: 1.8rem; margin-bottom: 14px; }
.problema-tarjeta__titulo { font-size: 1rem; font-weight: 600; margin-bottom: 10px; }
.problema-tarjeta__texto { font-size: 0.875rem; color: var(--color-texto-secundario); line-height: 1.7; }
.publico-objetivo { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 32px; }
.publico-objetivo__titulo { font-size: 0.8rem; font-family: var(--fuente-mono); color: var(--color-texto-tenue); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
.publico-objetivo__items { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.publico-item__rol { display: inline-block; font-size: 0.875rem; font-weight: 600; color: var(--color-acento); margin-bottom: 6px; }
.publico-item__desc { font-size: 0.85rem; color: var(--color-texto-secundario); line-height: 1.6; }
.funcionalidades-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.funcionalidad-tarjeta { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 24px; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
.funcionalidad-tarjeta:hover { border-color: rgba(88,166,255,0.3); box-shadow: 0 4px 20px rgba(88,166,255,0.06); transform: translateY(-2px); }
.funcionalidad-tarjeta--destacada { grid-column: span 2; border-color: rgba(88,166,255,0.2); background: linear-gradient(135deg, var(--color-superficie) 0%, rgba(88,166,255,0.04) 100%); }
.funcionalidad-tarjeta__icono { font-size: 1.6rem; margin-bottom: 12px; }
.funcionalidad-tarjeta__titulo { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
.funcionalidad-tarjeta__texto { font-size: 0.875rem; color: var(--color-texto-secundario); line-height: 1.7; margin-bottom: 12px; }
.funcionalidad-tarjeta__lista { display: flex; flex-direction: column; gap: 4px; }
.funcionalidad-tarjeta__lista li { font-size: 0.8rem; color: var(--color-texto-tenue); padding-left: 14px; position: relative; }
.funcionalidad-tarjeta__lista li::before { content: '›'; position: absolute; left: 0; color: var(--color-acento); }
.seccion-contacto__contenedor { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
.contacto-datos { margin-top: 20px; display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; color: var(--color-texto-secundario); }
.contacto-datos__institucion { color: var(--color-texto-tenue); font-family: var(--fuente-mono); font-size: 0.8rem; margin-top: 8px; }
.formulario-contacto { display: flex; flex-direction: column; gap: 16px; }
.campo-textarea { resize: vertical; min-height: 100px; }
.pie-pagina { background: var(--color-superficie); border-top: 1px solid var(--color-borde-sutil); }
.pie-pagina__contenedor { max-width: 1280px; margin: 0 auto; padding: 36px 24px 28px; display: flex; align-items: flex-start; gap: 48px; }
.pie-pagina__marca { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.pie-pagina__info { flex: 1; font-size: 0.825rem; color: var(--color-texto-tenue); display: flex; flex-direction: column; gap: 4px; }
.pie-pagina__nav { display: flex; gap: 20px; flex-shrink: 0; }
.pie-pagina__nav a, .pie-pagina__nav button { font-size: 0.825rem; color: var(--color-texto-tenue); transition: color 0.2s; }
.pie-pagina__nav a:hover, .pie-pagina__nav button:hover { color: var(--color-texto-primario); }
.pie-pagina__barra-inferior { border-top: 1px solid var(--color-borde-sutil); padding: 14px 24px; max-width: 1280px; margin: 0 auto; }
.pie-pagina__barra-inferior p { font-size: 0.78rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }

/* ══════════════════════════════════════════
   6. PROYECTOS.CSS
══════════════════════════════════════════ */
.stats-proyectos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.stat-proyecto-card { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; }
.stat-proyecto-card__num { font-family: var(--fuente-mono); font-size: 2rem; font-weight: 700; line-height: 1; color: var(--color-texto-primario); }
.stat-proyecto-card__lbl { font-size: 0.78rem; color: var(--color-texto-tenue); }
.lista-proyectos { display: flex; flex-direction: column; gap: 16px; }
.tarjeta-proyecto { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 24px; transition: border-color 0.2s, box-shadow 0.2s; }
.tarjeta-proyecto:hover { border-color: var(--color-borde); box-shadow: var(--sombra-sm); }
.tarjeta-proyecto__encabezado { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.tarjeta-proyecto__avatar { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--fuente-mono); font-size: 0.72rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.tarjeta-proyecto__info { flex: 1; }
.tarjeta-proyecto__nombre { font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; }
.tarjeta-proyecto__descripcion { font-size: 0.82rem; color: var(--color-texto-secundario); }
.btn-menu-proyecto { background: none; border: 1px solid transparent; border-radius: var(--radio-borde); color: var(--color-texto-tenue); cursor: pointer; font-size: 1rem; padding: 4px 8px; transition: background 0.15s, color 0.15s; }
.btn-menu-proyecto:hover { background: var(--color-superficie-alt); color: var(--color-texto-secundario); }
.tarjeta-proyecto__metricas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
.metrica-proyecto { display: flex; flex-direction: column; align-items: center; padding: 10px; border-radius: var(--radio-borde); border: 1px solid transparent; }
.metrica-proyecto--critico { background: var(--color-critico-fondo); border-color: rgba(248,81,73,0.15); }
.metrica-proyecto--alto    { background: var(--color-alto-fondo);    border-color: rgba(224,155,61,0.15); }
.metrica-proyecto--medio   { background: var(--color-medio-fondo);   border-color: rgba(227,179,65,0.15); }
.metrica-proyecto--bajo    { background: var(--color-bajo-fondo);    border-color: rgba(63,185,80,0.15); }
.metrica-proyecto__num { font-family: var(--fuente-mono); font-size: 1.4rem; font-weight: 700; line-height: 1; }
.metrica-proyecto--critico .metrica-proyecto__num { color: var(--color-critico); }
.metrica-proyecto--alto    .metrica-proyecto__num { color: var(--color-alto); }
.metrica-proyecto--medio   .metrica-proyecto__num { color: var(--color-medio); }
.metrica-proyecto--bajo    .metrica-proyecto__num { color: var(--color-bajo); }
.metrica-proyecto__lbl { font-size: 0.68rem; color: var(--color-texto-tenue); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--fuente-mono); }
.tarjeta-proyecto__progreso-remediacion { margin-bottom: 20px; }
.progreso-remediacion__info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.progreso-remediacion__texto { font-size: 0.8rem; color: var(--color-texto-tenue); }
.progreso-remediacion__porcentaje { font-family: var(--fuente-mono); font-size: 0.875rem; font-weight: 700; }
.barra-progreso-contenedor { height: 6px; background: var(--color-borde-sutil); border-radius: 3px; overflow: hidden; }
.barra-progreso-relleno { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.tarjeta-proyecto__pie { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tarjeta-proyecto__miembros { display: flex; align-items: center; gap: 6px; }
.miembros-conteo { font-size: 0.78rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); margin-left: 4px; }
.tarjeta-proyecto__acciones { display: flex; gap: 10px; }

/* ══════════════════════════════════════════
   7. REPORTES.CSS
══════════════════════════════════════════ */
.panel-generacion { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); padding: 24px; margin-bottom: 24px; }
.formulario-generacion__campos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
.formulario-generacion__opciones { display: flex; gap: 24px; flex-wrap: wrap; padding: 14px 0; border-top: 1px solid var(--color-borde-sutil); border-bottom: 1px solid var(--color-borde-sutil); margin-bottom: 16px; }
.formulario-generacion__pie { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.formulario-generacion__nota { font-size: 0.78rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }
.seccion-historial { background: var(--color-superficie); border: 1px solid var(--color-borde-sutil); border-radius: var(--radio-borde-lg); overflow: hidden; }
.seccion-historial__encabezado { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--color-borde-sutil); }
.lista-reportes { display: flex; flex-direction: column; }
.tarjeta-reporte { display: flex; align-items: center; gap: 14px; padding: 16px 24px; border-bottom: 1px solid var(--color-borde-sutil); transition: background 0.15s; }
.tarjeta-reporte:last-child { border-bottom: none; }
.tarjeta-reporte:hover { background: var(--color-superficie-alt); }
.tarjeta-reporte__icono { font-size: 1.5rem; flex-shrink: 0; width: 36px; text-align: center; }
.tarjeta-reporte__info { flex: 1; min-width: 0; }
.tarjeta-reporte__nombre { font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tarjeta-reporte__meta { display: flex; gap: 16px; flex-wrap: wrap; }
.reporte-meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--color-texto-tenue); font-family: var(--fuente-mono); }
.reporte-meta-item__icono { font-size: 0.75rem; }
.tarjeta-reporte__estado { flex-shrink: 0; }
.formato-badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-family: var(--fuente-mono); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.formato-badge--pdf  { background: rgba(248,81,73,0.12); color: #f85149; }
.formato-badge--html { background: rgba(88,166,255,0.12); color: var(--color-acento); }
.formato-badge--xlsx { background: rgba(63,185,80,0.12);  color: var(--color-bajo); }
.formato-badge--json { background: rgba(227,179,65,0.12); color: var(--color-medio); }
.tarjeta-reporte__acciones { display: flex; gap: 8px; flex-shrink: 0; }

/* ══════════════════════════════════════════
   8. HALLAZGOS.CSS
══════════════════════════════════════════ */
.barra-filtros { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
.barra-filtros__campo-busqueda { position: relative; flex: 1; min-width: 220px; }
.barra-filtros__selectores { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filtro-select { width: auto; min-width: 160px; font-size: 0.85rem; padding: 8px 32px 8px 12px; }
.acciones-fila { display: flex; gap: 4px; justify-content: flex-end; }

/* ══════════════════════════════════════════
   9. RESPONSIVE (unificado)
══════════════════════════════════════════ */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .fila-metricas-secundarias { grid-template-columns: 1fr; }
  .formulario-generacion__campos { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 1100px) {
  .barra-superior__busqueda { width: 200px; }
}
@media (max-width: 1024px) {
  .seccion-hero { grid-template-columns: 1fr; min-height: auto; padding-top: 80px; }
  .seccion-hero__panel-demo { max-width: 600px; }
  .funcionalidades-grid { grid-template-columns: repeat(2, 1fr); }
  .funcionalidad-tarjeta--destacada { grid-column: span 1; }
  .problema-grid { grid-template-columns: repeat(2, 1fr); }
  .problema-grid .problema-tarjeta:last-child { grid-column: span 2; }
}
@media (max-width: 900px) {
  .pagina-aplicacion { grid-template-columns: 1fr; grid-template-areas: "barra-superior" "contenido-principal"; }
  .barra-lateral { display: none; }
  .barra-superior__busqueda { display: none; }
  .stats-proyectos { grid-template-columns: repeat(2, 1fr); }
  .tarjeta-proyecto__metricas { grid-template-columns: repeat(2, 1fr); }
  .barra-filtros { flex-direction: column; align-items: stretch; }
  .barra-filtros__campo-busqueda { min-width: unset; }
  .barra-filtros__selectores { justify-content: flex-start; }
  .filtro-select { min-width: 120px; flex: 1; }
}
@media (max-width: 768px) {
  .encabezado-principal__nav, .encabezado-principal__acciones { display: none; }
  .encabezado-principal__hamburguesa { display: flex; }
  .menu-abierto { display: flex !important; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: var(--color-superficie); padding: 16px; gap: 4px; border-bottom: 1px solid var(--color-borde-sutil); }
  .seccion-hero { gap: 32px; padding: 80px 16px 40px; }
  .seccion-hero__stats { flex-wrap: wrap; gap: 16px; }
  .problema-grid, .funcionalidades-grid, .publico-objetivo__items { grid-template-columns: 1fr; }
  .problema-grid .problema-tarjeta:last-child { grid-column: span 1; }
  .funcionalidad-tarjeta--destacada { grid-column: span 1; }
  .seccion-contacto__contenedor { grid-template-columns: 1fr; gap: 32px; }
  .pie-pagina__contenedor { flex-direction: column; gap: 20px; }
  .panel-demo__metricas { grid-template-columns: repeat(2, 1fr); }
  .contenedor-autenticacion { grid-template-columns: 1fr; }
  .panel-info-sistema { display: none; }
  .panel-formulario { padding: 32px 24px; }
  .tabla-pie { flex-wrap: wrap; gap: 10px; }
  .seccion-tabla-hallazgos__encabezado { flex-direction: column; }
  .formulario-generacion__campos { grid-template-columns: 1fr; }
  .formulario-generacion__opciones { flex-direction: column; gap: 12px; }
  .formulario-generacion__pie { flex-direction: column; align-items: flex-start; }
  .tarjeta-reporte { flex-wrap: wrap; }
  .tarjeta-reporte__info { min-width: 100%; order: -1; }
}
@media (max-width: 700px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .contenido-principal { padding: 20px 16px; }
  .encabezado-pagina { flex-direction: column; }
  .stats-proyectos { grid-template-columns: 1fr 1fr; }
  .tarjeta-proyecto__pie { flex-direction: column; align-items: flex-start; }
  .tarjeta-proyecto__acciones { width: 100%; }
  .tarjeta-proyecto__acciones .btn { flex: 1; justify-content: center; }
}
@media (max-width: 480px) {
  .seccion-hero__ctas { flex-direction: column; }
  .seccion-hero__ctas .btn { width: 100%; justify-content: center; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .tarjeta-kpi__valor { font-size: 2rem; }
  .panel-formulario { padding: 24px 16px; }
  .registro-fila-doble { grid-template-columns: 1fr; }
}
`;

export default estilos;
