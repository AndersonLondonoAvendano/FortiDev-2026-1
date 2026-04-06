/**
 * PaginaEscaneos.jsx
 * Página de gestión de escaneos de seguridad (escaneos.html).
 * Similar a PaginaHallazgos, con filtros y tabla de escaneos.
 */

import LayoutApp from "../components/shared/LayoutApp.jsx";
import TablaHallazgos from "../components/shared/TablaHallazgos.jsx";
import Paginacion from "../components/shared/Paginacion.jsx";
import { useFiltros } from "../hooks/useFiltros.js";

const ESCANEOS_MOCK = [
  {
    id: 1,
    tipo: "OWASP ZAP",
    proyecto: "Proyecto Alpha",
    estado: "Completado",
    fecha: "2026-04-01",
    hallazgos: 12,
    severidad: "Crítico",
  },
  {
    id: 2,
    tipo: "SonarQube",
    proyecto: "Proyecto Beta",
    estado: "En progreso",
    fecha: "2026-04-02",
    hallazgos: 8,
    severidad: "Alto",
  },
  {
    id: 3,
    tipo: "Nessus",
    proyecto: "Proyecto Gamma",
    estado: "Pendiente",
    fecha: "2026-04-03",
    hallazgos: 0,
    severidad: "Bajo",
  },
];

const TABS = [
  { id: "todos", label: "Todos" },
  { id: "completados", label: "Completados" },
  { id: "en-progreso", label: "En progreso" },
  { id: "pendientes", label: "Pendientes" },
];

export default function PaginaEscaneos() {
  const {
    filtroSeveridad, setFiltroSeveridad,
    filtroEstado, setFiltroEstado,
    filtroProyecto, setFiltroProyecto,
    filtroTexto, setFiltroTexto,
    tabActiva, setTabActiva,
    datosFiltrados,
    limpiarFiltros,
  } = useFiltros(ESCANEOS_MOCK);

  const conteos = {
    todos: ESCANEOS_MOCK.length,
    completados: ESCANEOS_MOCK.filter((e) => e.estado === "Completado").length,
    "en-progreso": ESCANEOS_MOCK.filter((e) => e.estado === "En progreso").length,
    pendientes: ESCANEOS_MOCK.filter((e) => e.estado === "Pendiente").length,
  };

  return (
    <LayoutApp
      pagina="escaneos"
      tituloBarra="Escaneos"
      placeholderBusqueda="Buscar escaneos..."
    >
      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Escaneos de seguridad</h2>
          <p className="encabezado-pagina__descripcion">
            Gestión y ejecución de escaneos automatizados —{" "}
            {ESCANEOS_MOCK.length} escaneos programados en todos los proyectos
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--secundario">
            <i className="bi bi-gear"></i> Configurar escaneos
          </button>
          <button className="btn btn--primario">+ Nuevo escaneo</button>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="barra-filtros" role="search">
        <div className="barra-filtros__campo-busqueda">
          <span
            className="campo-input-icono"
            style={{ left: "12px", position: "absolute", color: "var(--color-texto-tenue)" }}
          >
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="campo-input"
            style={{ paddingLeft: "36px" }}
            placeholder="Buscar por tipo, proyecto o estado..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>

        <div className="barra-filtros__selectores">
          <select
            className="campo-input campo-select filtro-select"
            value={filtroSeveridad}
            onChange={(e) => setFiltroSeveridad(e.target.value)}
          >
            <option value="">Severidad: Todas</option>
            <option value="Crítico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>

          <select
            className="campo-input campo-select filtro-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Estado: Todos</option>
            <option value="Completado">Completado</option>
            <option value="En progreso">En progreso</option>
            <option value="Pendiente">Pendiente</option>
          </select>

          <select
            className="campo-input campo-select filtro-select"
            value={filtroProyecto}
            onChange={(e) => setFiltroProyecto(e.target.value)}
          >
            <option value="">Proyecto: Todos</option>
            <option value="Alpha">Proyecto Alpha</option>
            <option value="Beta">Proyecto Beta</option>
            <option value="Gamma">Proyecto Gamma</option>
          </select>

          <button
            className="btn btn--secundario btn--sm"
            onClick={limpiarFiltros}
          >
            <i className="bi bi-x-lg"></i> Limpiar
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <nav className="tabs-navegacion" aria-label="Filtros de estado">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-item btn-reset${tabActiva === id ? " tab-item--activo" : ""}`}
            onClick={() => setTabActiva(id)}
          >
            {label}
            <span className="tab-item__conteo">{conteos[id]}</span>
          </button>
        ))}
      </nav>

      {/* ── TABLA ── */}
      <div className="seccion-tabla-hallazgos">
        {/* Placeholder para tabla de escaneos, usando TablaHallazgos temporalmente */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3>Tabla de Escaneos</h3>
          <p>Contenido en desarrollo. Aquí se mostrará la lista de escaneos con filtros aplicados.</p>
          <ul>
            {datosFiltrados.map((escaneo) => (
              <li key={escaneo.id}>
                {escaneo.tipo} - {escaneo.proyecto} - {escaneo.estado} - {escaneo.fecha}
              </li>
            ))}
          </ul>
        </div>
        <Paginacion
          total={ESCANEOS_MOCK.length}
          mostrando={datosFiltrados.length}
        />
      </div>
    </LayoutApp>
  );
}