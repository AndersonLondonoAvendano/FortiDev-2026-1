/**
 * MarcaLogo.jsx
 * Logo de FortiDev reutilizable en header, sidebar y footer.
 */

export default function MarcaLogo() {
  return (
    <>
      <span className="marca-icono" aria-hidden="true">
        <i className="bi bi-shield-shaded"></i>
      </span>
      <span className="marca-nombre">
        Forti<strong>Dev</strong>
      </span>
      <span className="marca-etiqueta">PTaaS</span>
    </>
  );
}
