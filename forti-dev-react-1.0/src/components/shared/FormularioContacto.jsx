/**
 * FormularioContacto.jsx
 * Formulario de contacto de la landing page.
 * Gestiona su propio estado y simula el envío.
 */

import { useState } from "react";

export default function FormularioContacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState({ nombre: "", email: "", mensaje: "" });

  const validateForm = () => {
    const newErrors = { nombre: "", email: "", mensaje: "" };
    let isValid = true;

    // Validación del nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(form.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios.";
      isValid = false;
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
      isValid = false;
    }

    // Validación del email
    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Por favor ingresa un correo electrónico válido.";
      isValid = false;
    }

    // Validación del mensaje
    if (!form.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio.";
      isValid = false;
    } else if (form.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: reemplazar con fetch() al backend
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
      setForm({ nombre: "", email: "", mensaje: "" });
      setErrors({ nombre: "", email: "", mensaje: "" });
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    // Limpiar error al cambiar el campo
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
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
          onChange={handleChange("nombre")}
        />
        {errors.nombre && <span className="error-mensaje">{errors.nombre}</span>}
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
          onChange={handleChange("email")}
        />
        {errors.email && <span className="error-mensaje">{errors.email}</span>}
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
          onChange={handleChange("mensaje")}
        ></textarea>
        {errors.mensaje && <span className="error-mensaje">{errors.mensaje}</span>}
      </div>

      <button className="btn btn--primario" onClick={handleSubmit}>
        {enviado ? "✓ Mensaje enviado" : "Enviar mensaje"}
      </button>
    </div>
  );
}
