/**
 * LayoutApp.jsx
 * Layout con sidebar para todas las páginas internas (dashboard, proyectos, etc.).
 * Envuelve el contenido con BarraLateral + BarraSuperior + main.
 */

import { useState } from "react";
import BarraLateral from "./BarraLateral.jsx";
import BarraSuperior from "./BarraSuperior.jsx";

export default function LayoutApp({
  pagina,
  children,
  tituloBarra,
  placeholderBusqueda,
}) {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="pagina-aplicacion">
      <BarraLateral paginaActiva={pagina} onMostrarModal={setMostrarModal} />
      <BarraSuperior titulo={tituloBarra} placeholder={placeholderBusqueda} />
      <main className="contenido-principal" id="contenido-principal">
        {children}
      </main>

      {/* Modal de construcción centrado */}
      {mostrarModal && (
        <div
          className="modal-overlay"
          onClick={() => setMostrarModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-construccion"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              textAlign: 'center',
              color: 'black',
            }}
          >
            <h3>Sección en Construcción</h3>
            <p>Esta página está bajo desarrollo y no puede ser accedida en este momento.</p>
            <button
              className="btn btn--primario"
              onClick={() => setMostrarModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
