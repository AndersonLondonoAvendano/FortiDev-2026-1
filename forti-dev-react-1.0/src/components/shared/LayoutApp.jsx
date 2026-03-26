/**
 * LayoutApp.jsx
 * Layout con sidebar para todas las páginas internas (dashboard, proyectos, etc.).
 * Envuelve el contenido con BarraLateral + BarraSuperior + main.
 */

import BarraLateral from "./BarraLateral.jsx";
import BarraSuperior from "./BarraSuperior.jsx";

export default function LayoutApp({
  pagina,
  children,
  tituloBarra,
  placeholderBusqueda,
}) {
  return (
    <div className="pagina-aplicacion">
      <BarraLateral paginaActiva={pagina} />
      <BarraSuperior titulo={tituloBarra} placeholder={placeholderBusqueda} />
      <main className="contenido-principal" id="contenido-principal">
        {children}
      </main>
    </div>
  );
}
