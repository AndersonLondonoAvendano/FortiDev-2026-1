/**
 * useFiltros.js
 * Reemplaza: FiltrarHallazgos.js
 *
 * Hook personalizado que gestiona el filtrado de hallazgos
 * por severidad, estado, proyecto, texto libre y tab activa.
 */

import { useState } from "react";

export function useFiltros(datos) {
  const [filtroSeveridad, setFiltroSeveridad] = useState("");
  const [filtroEstado,    setFiltroEstado]    = useState("");
  const [filtroProyecto,  setFiltroProyecto]  = useState("");
  const [filtroTexto,     setFiltroTexto]     = useState("");
  const [tabActiva,       setTabActiva]       = useState("todos");

  // Normaliza texto: minúsculas y sin tildes
  const normalizar = (t) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const datosFiltrados = datos.filter((h) => {
    const matchSeveridad = !filtroSeveridad || normalizar(h.severidad) === normalizar(filtroSeveridad);
    const matchEstado    = !filtroEstado    || normalizar(h.estado)    === normalizar(filtroEstado);
    const matchProyecto  = !filtroProyecto  || normalizar(h.proyecto).includes(normalizar(filtroProyecto));
    const matchTexto     = !filtroTexto     || normalizar(h.tipo).includes(normalizar(filtroTexto));
    const matchTab =
      tabActiva === "todos" ||
      (tabActiva === "abiertos"    && normalizar(h.estado) === "abierto") ||
      (tabActiva === "en-progreso" && normalizar(h.estado) === "en progreso") ||
      (tabActiva === "resueltos"   && normalizar(h.estado) === "resuelto");

    return matchSeveridad && matchEstado && matchProyecto && matchTexto && matchTab;
  });

  const limpiarFiltros = () => {
    setFiltroSeveridad("");
    setFiltroEstado("");
    setFiltroProyecto("");
    setFiltroTexto("");
  };

  return {
    filtroSeveridad, setFiltroSeveridad,
    filtroEstado,    setFiltroEstado,
    filtroProyecto,  setFiltroProyecto,
    filtroTexto,     setFiltroTexto,
    tabActiva,       setTabActiva,
    datosFiltrados,
    limpiarFiltros,
  };
}
