/**
 * PaginaHallazgos.jsx
 * Página de gestión de hallazgos de seguridad (hallazgos.html).
 * Reemplaza: FiltrarHallazgos.js — ahora usa el hook useFiltros
 *
 * Funcionalidades:
 *  - Filtros por severidad, estado, proyecto y texto libre
 *  - Tabs: Todos / Abiertos / En progreso / Resueltos
 *  - Tabla paginada de hallazgos
 */

import LayoutApp from "../components/shared/LayoutApp.jsx";
import TablaHallazgos from "../components/shared/TablaHallazgos.jsx";
import Paginacion from "../components/shared/Paginacion.jsx";
import { useFiltros } from "../hooks/useFiltros.js";
import { HALLAZGOS_MOCK } from "../data/hallazgos.js";

const TABS = [
  { id: "todos",       label: "Todos" },
  { id: "abiertos",    label: "Abiertos" },
  { id: "en-progreso", label: "En progreso" },
  { id: "resueltos",   label: "Resueltos" },
];

export default function PaginaHallazgos() {
  const {
    filtroSeveridad, setFiltroSeveridad,
    filtroEstado,    setFiltroEstado,
    filtroProyecto,  setFiltroProyecto,
    filtroTexto,     setFiltroTexto,
    tabActiva,       setTabActiva,
    datosFiltrados,
    limpiarFiltros,
  } = useFiltros(HALLAZGOS_MOCK);

  const conteos = {
    todos:         HALLAZGOS_MOCK.length,
    abiertos:      HALLAZGOS_MOCK.filter((h) => h.estado === "Abierto").length,
    "en-progreso": HALLAZGOS_MOCK.filter((h) => h.estado === "En progreso").length,
    resueltos:     HALLAZGOS_MOCK.filter((h) => h.estado === "Resuelto").length,
  };

  return (
    <LayoutApp
      pagina="hallazgos"
      tituloBarra="Hallazgos"
      placeholderBusqueda="Buscar hallazgos..."
    >
      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Hallazgos de seguridad</h2>
          <p className="encabezado-pagina__descripcion">
            Gestión centralizada de vulnerabilidades —{" "}
            {HALLAZGOS_MOCK.length} hallazgos activos en todos los proyectos
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--secundario">
            <i className="bi bi-upload"></i> Importar resultados
          </button>
          <button className="btn btn--primario">+ Nuevo hallazgo</button>
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
            placeholder="Buscar por tipo, descripción o proyecto..."
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
            <option value="Abierto">Abierto</option>
            <option value="En progreso">En progreso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Verificado">Verificado</option>
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
        <TablaHallazgos hallazgos={datosFiltrados} />
        <Paginacion
          total={HALLAZGOS_MOCK.length}
          mostrando={datosFiltrados.length}
        />
      </div>
    </LayoutApp>
  );
}
