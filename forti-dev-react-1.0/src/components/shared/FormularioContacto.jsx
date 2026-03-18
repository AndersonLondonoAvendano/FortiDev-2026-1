/**
 * FormularioContacto.jsx
 * Formulario de contacto de la landing page.
 * Gestiona su propio estado y simula el envío.
 */

import { useState } from "react";

export default function FormularioContacto() {
  const [form, setForm]       = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }
    // TODO: reemplazar con fetch() al backend
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="formulario-contacto">
      <div className="campo-grupo">
        <label className="campo-etiqueta" htmlFor="contacto-nombre">
          Nombre completo
        </label>
        <input
          type="text"
          id="contacto-nombre"
          className="campo-input"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
      </div>

      <div className="campo-grupo">
        <label className="campo-etiqueta" htmlFor="contacto-email">
          Correo electrónico
        </label>
        <input
          type="email"
          id="contacto-email"
          className="campo-input"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="campo-grupo">
        <label className="campo-etiqueta" htmlFor="contacto-mensaje">
          Mensaje
        </label>
        <textarea
          id="contacto-mensaje"
          className="campo-input campo-textarea"
          rows="4"
          placeholder="Escribe tu mensaje..."
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
        ></textarea>
      </div>

      <button className="btn btn--primario" onClick={handleSubmit}>
        {enviado ? "✓ Mensaje enviado" : "Enviar mensaje"}
      </button>
    </div>
  );
}
