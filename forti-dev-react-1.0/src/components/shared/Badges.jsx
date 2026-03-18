/**
 * Badges.jsx
 * Componentes atómicos de UI reutilizables:
 *  - EtiquetaSeveridad  → badge de nivel de severidad (Crítico / Alto / Medio / Bajo)
 *  - EstadoBadge        → badge de estado (Abierto / En progreso / Resuelto / Verificado)
 *  - ScoreBadge         → número CVSS coloreado por severidad
 */

export function EtiquetaSeveridad({ nivel }) {
  const clases = {
    Crítico: "etiqueta-severidad etiqueta-severidad--critico",
    Alto:    "etiqueta-severidad etiqueta-severidad--alto",
    Medio:   "etiqueta-severidad etiqueta-severidad--medio",
    Bajo:    "etiqueta-severidad etiqueta-severidad--bajo",
  };
  return (
    <span className={clases[nivel] || "etiqueta-severidad"}>{nivel}</span>
  );
}

export function EstadoBadge({ estado }) {
  const map = {
    Abierto:       "estado-badge estado-badge--abierto",
    "En progreso": "estado-badge estado-badge--en-progreso",
    Resuelto:      "estado-badge estado-badge--resuelto",
    Verificado:    "estado-badge estado-badge--verificado",
  };
  return (
    <span className={map[estado] || "estado-badge"}>{estado}</span>
  );
}

export function ScoreBadge({ score, severidad }) {
  const clases = {
    Crítico: "celda-score celda-score--critico",
    Alto:    "celda-score celda-score--alto",
    Medio:   "celda-score celda-score--medio",
    Bajo:    "celda-score celda-score--bajo",
  };
  return (
    <span className={clases[severidad] || "celda-score"}>{score}</span>
  );
}
