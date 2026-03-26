/**
 * PaginaProyectos.jsx
 * Página de gestión de proyectos (proyectos.html).
 * Lee los datos desde src/data/proyectos.js
 */

import { useNavigate } from "react-router-dom";
import LayoutApp from "../components/shared/LayoutApp.jsx";
import { PROYECTOS } from "../data/proyectos.js";

export default function PaginaProyectos() {
  const navigate = useNavigate();
  return (
    <LayoutApp
      pagina="proyectos"
      tituloBarra="Proyectos"
      placeholderBusqueda="Buscar proyectos..."
    >
      {/* ── ENCABEZADO ── */}
      <div className="encabezado-pagina">
        <div className="encabezado-pagina__info">
          <h2 className="encabezado-pagina__titulo">Gestión de proyectos</h2>
          <p className="encabezado-pagina__descripcion">
            3 proyectos activos · Organización TecnoApp SAS
          </p>
        </div>
        <div className="encabezado-pagina__acciones">
          <button className="btn btn--primario">+ Nuevo proyecto</button>
        </div>
      </div>

      {/* ── STATS RÁPIDAS ── */}
      <div className="stats-proyectos">
        {[
          { num: "3",  color: "",                      lbl: "Proyectos activos" },
          { num: "46", color: "var(--color-critico)",  lbl: "Hallazgos abiertos" },
          { num: "68", color: "var(--color-bajo)",     lbl: "Resueltos este mes" },
          { num: "5",  color: "var(--color-acento)",   lbl: "Escaneos pendientes" },
        ].map(({ num, color, lbl }) => (
          <div className="stat-proyecto-card" key={lbl}>
            <span
              className="stat-proyecto-card__num"
              style={color ? { color } : {}}
            >
              {num}
            </span>
            <span className="stat-proyecto-card__lbl">{lbl}</span>
          </div>
        ))}
      </div>

      {/* ── LISTA DE PROYECTOS ── */}
      <div className="lista-proyectos">
        {PROYECTOS.map((p) => (
          <article className="tarjeta-proyecto" key={p.id}>

            {/* Encabezado */}
            <div className="tarjeta-proyecto__encabezado">
              <div
                className="tarjeta-proyecto__avatar"
                style={{ background: p.gradient }}
              >
                {p.siglas}
              </div>
              <div className="tarjeta-proyecto__info">
                <h3 className="tarjeta-proyecto__nombre">{p.nombre}</h3>
                <p className="tarjeta-proyecto__descripcion">{p.desc}</p>
              </div>
              <div className="tarjeta-proyecto__estado">
                <span className={`estado-badge estado-badge--${p.estadoMod}`}>
                  {p.estado}
                </span>
              </div>
              <button
                className="btn-menu-proyecto"
                aria-label={`Opciones de ${p.nombre}`}
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
            </div>

            {/* Métricas */}
            <div className="tarjeta-proyecto__metricas">
              {Object.entries(p.metricas).map(([nivel, num]) => (
                <div key={nivel} className={`metrica-proyecto metrica-proyecto--${nivel}`}>
                  <span className="metrica-proyecto__num">{num}</span>
                  <span className="metrica-proyecto__lbl">
                    {nivel === "critico" ? "Críticas"
                      : nivel === "alto"  ? "Altas"
                      : nivel === "medio" ? "Medias"
                      : "Bajas"}
                  </span>
                </div>
              ))}
            </div>

            {/* Barra de progreso */}
            <div className="tarjeta-proyecto__progreso-remediacion">
              <div className="progreso-remediacion__info">
                <span className="progreso-remediacion__texto">
                  Progreso de remediación
                </span>
                <span
                  className="progreso-remediacion__porcentaje"
                  style={{ color: p.progresoColor }}
                >
                  {p.progreso}%
                </span>
              </div>
              <div className="barra-progreso-contenedor">
                <div
                  className="barra-progreso-relleno"
                  style={{ width: `${p.progreso}%`, background: p.progresoColor }}
                ></div>
              </div>
            </div>

            {/* Pie */}
            <div className="tarjeta-proyecto__pie">
              <div className="tarjeta-proyecto__miembros">
                {p.miembros.map((m) => (
                  <span key={m} className="avatar-usuario-mini">{m}</span>
                ))}
                <span className="miembros-conteo">
                  +{p.extrasAnalistas} analista{p.extrasAnalistas > 1 ? "s" : ""}
                </span>
              </div>
              <div className="tarjeta-proyecto__acciones">
                <button
                  className="btn btn--secundario btn--sm"
                  onClick={() => navigate("/hallazgos")}
                >
                  Ver hallazgos
                </button>
                <button className="btn btn--primario btn--sm">
                  Iniciar escaneo
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </LayoutApp>
  );
}
