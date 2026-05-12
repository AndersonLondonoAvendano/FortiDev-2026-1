/**
 * TablaHallazgos.jsx
 * Tabla de hallazgos con panel de detalle expandible por fila.
 * Props:
 *  - hallazgos       → array de hallazgos (campos del API + campos adaptados)
 *  - modoCompacto    → boolean — usado en Dashboard (columnas reducidas)
 *  - onStatusChange  → async (id, newStatus) => void — opcional
 */

import { useState } from "react";

const SEVERITY_CONFIG = {
  CRITICAL: { label: "Crítico",    color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  HIGH:     { label: "Alto",       color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  MEDIUM:   { label: "Medio",      color: "#eab308", bg: "rgba(234,179,8,0.12)" },
  LOW:      { label: "Bajo",       color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  INFO:     { label: "Info",       color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const STATUS_FLOW = ["OPEN", "IN_PROGRESS", "RESOLVED", "ACCEPTED_RISK", "FALSE_POSITIVE"];
const STATUS_LABELS = {
  OPEN: "Abierto", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto",
  ACCEPTED_RISK: "Riesgo aceptado", FALSE_POSITIVE: "Falso positivo",
};

function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.INFO;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
    }}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const colors = {
    OPEN: "#ef4444", IN_PROGRESS: "#f97316", RESOLVED: "#22c55e",
    ACCEPTED_RISK: "#6b7280", FALSE_POSITIVE: "#a855f7",
  };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: colors[status] || "#6b7280",
      background: `${colors[status] || "#6b7280"}1a`,
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function cweLink(cwe) {
  if (!cwe) return null;
  const match = cwe.match(/(\d+)/);
  if (!match) return <span>{cwe}</span>;
  return (
    <a
      href={`https://cwe.mitre.org/data/definitions/${match[1]}.html`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--color-acento)" }}
    >
      {cwe}
    </a>
  );
}

function DetailPanel({ hallazgo, onStatusChange, onClose }) {
  const [changingStatus, setChangingStatus] = useState(false);

  async function handleStatusChange(newStatus) {
    if (!onStatusChange) return;
    setChangingStatus(true);
    try {
      await onStatusChange(hallazgo.id, newStatus);
    } finally {
      setChangingStatus(false);
    }
  }

  const nextStatuses = STATUS_FLOW.filter((s) => s !== hallazgo.status);

  return (
    <tr>
      <td colSpan={100} style={{ padding: 0, background: "var(--color-fondo)" }}>
        <div
          style={{
            padding: "24px 32px",
            borderTop: `3px solid ${SEVERITY_CONFIG[hallazgo.severity]?.color || "#6b7280"}`,
            animation: "expandRow 0.2s ease",
          }}
        >
          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{hallazgo.title}</h3>
              <div style={{ marginTop: "6px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <SeverityBadge severity={hallazgo.severity} />
                <StatusBadge status={hallazgo.status} />
              </div>
            </div>
            <button
              className="btn-accion-fila"
              onClick={onClose}
              title="Cerrar detalle"
              style={{ flexShrink: 0 }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* ── Descripción ── */}
          {hallazgo.description && (
            <p style={{ marginBottom: "16px", color: "var(--color-texto-secundario)", lineHeight: 1.6, maxWidth: "800px" }}>
              {hallazgo.description}
            </p>
          )}

          {/* ── Metadatos en grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "Archivo", value: hallazgo.filePath },
              { label: "Líneas", value: hallazgo.lineStart != null ? `${hallazgo.lineStart}${hallazgo.lineEnd && hallazgo.lineEnd !== hallazgo.lineStart ? ` – ${hallazgo.lineEnd}` : ""}` : null },
              { label: "Regla", value: hallazgo.rule },
              { label: "Categoría", value: hallazgo.category },
              { label: "OWASP", value: hallazgo.owasp },
              { label: "Asignado a", value: hallazgo.assignedUser?.name || null },
            ].filter((m) => m.value).map(({ label, value }) => (
              <div key={label} style={{ background: "var(--color-superficie)", borderRadius: "8px", padding: "10px 14px" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--color-texto-tenue)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{value}</div>
              </div>
            ))}
            {hallazgo.cwe && (
              <div style={{ background: "var(--color-superficie)", borderRadius: "8px", padding: "10px 14px" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--color-texto-tenue)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>CWE</div>
                <div style={{ fontSize: "0.85rem" }}>{cweLink(hallazgo.cwe)}</div>
              </div>
            )}
          </div>

          {/* ── Bloque de código ── */}
          {hallazgo.codeSnippet && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--color-texto-tenue)", marginBottom: "6px" }}>
                <i className="bi bi-code-slash"></i> Código afectado
                {hallazgo.lineStart != null && (
                  <span style={{ marginLeft: "8px", opacity: 0.7 }}>· línea {hallazgo.lineStart}</span>
                )}
              </div>
              <pre style={{
                background: "#0d1117",
                color: "#e6edf3",
                borderRadius: "8px",
                padding: "16px",
                overflowX: "auto",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                margin: 0,
                border: "1px solid #30363d",
              }}>
                <code>{hallazgo.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* ── Acciones de estado ── */}
          {onStatusChange && nextStatuses.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--color-texto-tenue)" }}>Cambiar estado:</span>
              {nextStatuses.map((s) => (
                <button
                  key={s}
                  className="btn btn--secundario btn--sm"
                  disabled={changingStatus}
                  onClick={() => handleStatusChange(s)}
                  style={{ fontSize: "0.78rem" }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function TablaHallazgos({ hallazgos, modoCompacto = false, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);

  function toggleRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <style>{`
        @keyframes expandRow {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fila-hallazgo { cursor: pointer; }
        .fila-hallazgo:hover { background: var(--color-fondo) !important; }
        .fila-hallazgo--activa { background: var(--color-fondo) !important; }
      `}</style>
      <div className="contenedor-tabla-scroll">
        <table className="tabla-datos" id="tabla-hallazgos">
          <thead>
            <tr>
              <th style={{ width: "28px" }}></th>
              <th className="th-sortable">Hallazgo</th>
              <th>Severidad</th>
              {!modoCompacto && <th>Categoría</th>}
              <th>Estado</th>
              <th className="th-sortable">Fecha</th>
              <th>Asignado a</th>
              {!modoCompacto && <th>Archivo</th>}
            </tr>
          </thead>
          <tbody>
            {hallazgos.map((h) => {
              const isExpanded = expandedId === h.id;
              return (
                <>
                  <tr
                    key={h.id}
                    className={`fila-hallazgo${isExpanded ? " fila-hallazgo--activa" : ""}`}
                    onClick={() => toggleRow(h.id)}
                    title="Click para ver detalle"
                  >
                    <td style={{ textAlign: "center", color: "var(--color-texto-tenue)", fontSize: "0.75rem" }}>
                      <i className={`bi bi-chevron-${isExpanded ? "down" : "right"}`}></i>
                    </td>
                    <td className="celda-nombre-hallazgo">
                      <span style={{ fontWeight: 600, display: "block" }}>{h.title}</span>
                      {h.rule && (
                        <span style={{ fontSize: "0.72rem", color: "var(--color-texto-tenue)", display: "block", marginTop: "2px" }}>
                          {h.rule}
                        </span>
                      )}
                    </td>
                    <td><SeverityBadge severity={h.severity} /></td>
                    {!modoCompacto && (
                      <td style={{ fontSize: "0.82rem", color: "var(--color-texto-tenue)" }}>
                        {h.category || "—"}
                      </td>
                    )}
                    <td><StatusBadge status={h.status} /></td>
                    <td className="celda-fecha" style={{ fontSize: "0.82rem", color: "var(--color-texto-tenue)" }}>
                      {h.createdAt ? new Date(h.createdAt).toLocaleDateString("es-CO") : "—"}
                    </td>
                    <td className="celda-asignado" style={{ fontSize: "0.82rem" }}>
                      {h.assignedUser?.name || <span style={{ color: "var(--color-texto-tenue)" }}>—</span>}
                    </td>
                    {!modoCompacto && (
                      <td style={{ fontSize: "0.75rem", color: "var(--color-texto-tenue)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {h.filePath || "—"}
                      </td>
                    )}
                  </tr>
                  {isExpanded && (
                    <DetailPanel
                      key={`detail-${h.id}`}
                      hallazgo={h}
                      onStatusChange={onStatusChange}
                      onClose={() => setExpandedId(null)}
                    />
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
