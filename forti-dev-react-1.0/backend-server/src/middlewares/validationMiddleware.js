/**
 * validationMiddleware.js
 * Middleware de validación para entradas de usuario
 * Valida y sanitiza datos de entrada antes de llegar al controlador
 */

// Expresiones regulares para validación
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
  contrasena: /^.{8,}$/, // Mínimo 8 caracteres
  rol: /^(admin|dev|analista)$/i,
};

// Mensajes de error estandarizados
const ERROR_MESSAGES = {
  nombre: {
    required: 'El nombre es requerido.',
    invalid: 'El nombre solo puede contener letras y espacios (2-100 caracteres).',
  },
  email: {
    required: 'El correo electrónico es requerido.',
    invalid: 'El correo electrónico no es válido.',
  },
  contrasena: {
    required: 'La contraseña es requerida.',
    invalid: 'La contraseña debe tener al menos 8 caracteres.',
    weak: 'La contraseña debe contener mayúsculas, números y caracteres especiales.',
  },
  rol: {
    required: 'El rol es requerido.',
    invalid: 'El rol debe ser: admin, dev o analista.',
  },
};

/**
 * Sanitiza una cadena de texto
 * @param {string} str - Cadena a sanitizar
 * @returns {string} - Cadena sanitizada
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Valida la fuerza de la contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} - { isStrong: boolean, score: number }
 */
const validatePasswordStrength = (password) => {
  let score = 0;
  const checks = {
    hasLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) score++;
  });

  return {
    isStrong: score >= 3,
    score,
    checks,
  };
};

/**
 * Validación de registro
 * Middleware que valida: nombre, email, rol, contraseña
 */
const validateRegister = (req, res, next) => {
  const { nombre, email, rol, contrasena } = req.body;
  const errors = {};

  // Validación de nombre
  const sanitizedNombre = sanitizeString(nombre);
  if (!sanitizedNombre) {
    errors.nombre = ERROR_MESSAGES.nombre.required;
  } else if (!PATTERNS.nombre.test(sanitizedNombre)) {
    errors.nombre = ERROR_MESSAGES.nombre.invalid;
  }

  // Validación de email
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  if (!sanitizedEmail) {
    errors.email = ERROR_MESSAGES.email.required;
  } else if (!PATTERNS.email.test(sanitizedEmail)) {
    errors.email = ERROR_MESSAGES.email.invalid;
  }

  // Validación de rol
  if (!rol) {
    errors.rol = ERROR_MESSAGES.rol.required;
  } else if (!PATTERNS.rol.test(rol)) {
    errors.rol = ERROR_MESSAGES.rol.invalid;
  }

  // Validación de contraseña
  if (!contrasena) {
    errors.contrasena = ERROR_MESSAGES.contrasena.required;
  } else if (!PATTERNS.contrasena.test(contrasena)) {
    errors.contrasena = ERROR_MESSAGES.contrasena.invalid;
  } else {
    const passwordStrength = validatePasswordStrength(contrasena);
    if (!passwordStrength.isStrong) {
      errors.contrasena = ERROR_MESSAGES.contrasena.weak;
    }
  }

  // Si hay errores, retornar respuesta de validación
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validación fallida.',
      errors,
    });
  }

  // Pasar datos sanitizados al siguiente middleware
  req.body.nombre = sanitizedNombre;
  req.body.email = sanitizedEmail;
  req.body.rol = rol.toLowerCase();
  req.body.contrasena = contrasena; // No sanitizar contraseña

  next();
};

/**
 * Validación de login
 * Middleware que valida: email, contraseña
 */
const validateLogin = (req, res, next) => {
  const { email, contrasena } = req.body;
  const errors = {};

  // Validación de email
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  if (!sanitizedEmail) {
    errors.email = ERROR_MESSAGES.email.required;
  } else if (!PATTERNS.email.test(sanitizedEmail)) {
    errors.email = ERROR_MESSAGES.email.invalid;
  }

  // Validación de contraseña
  if (!contrasena) {
    errors.contrasena = ERROR_MESSAGES.contrasena.required;
  } else if (typeof contrasena !== 'string') {
    errors.contrasena = 'La contraseña debe ser texto.';
  }

  // Si hay errores, retornar respuesta de validación
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validación fallida.',
      errors,
    });
  }

  // Pasar datos sanitizados al siguiente middleware
  req.body.email = sanitizedEmail;
  req.body.contrasena = contrasena;

  next();
};

/**
 * Validación de actualización de perfil
 * Middleware que valida: nombre, email, rol (opcionales pero si se envían deben ser válidos)
 */
const validateUpdateProfile = (req, res, next) => {
  const { nombre, email, rol } = req.body;
  const errors = {};

  // Validación de nombre (opcional pero si se envía debe ser válido)
  if (nombre !== undefined) {
    const sanitizedNombre = sanitizeString(nombre);
    if (sanitizedNombre && !PATTERNS.nombre.test(sanitizedNombre)) {
      errors.nombre = ERROR_MESSAGES.nombre.invalid;
    } else if (sanitizedNombre) {
      req.body.nombre = sanitizedNombre;
    }
  }

  // Validación de email (opcional pero si se envía debe ser válido)
  if (email !== undefined) {
    const sanitizedEmail = sanitizeString(email).toLowerCase();
    if (sanitizedEmail && !PATTERNS.email.test(sanitizedEmail)) {
      errors.email = ERROR_MESSAGES.email.invalid;
    } else if (sanitizedEmail) {
      req.body.email = sanitizedEmail;
    }
  }

  // Validación de rol (opcional pero si se envía debe ser válido)
  if (rol !== undefined) {
    if (!PATTERNS.rol.test(rol)) {
      errors.rol = ERROR_MESSAGES.rol.invalid;
    } else {
      req.body.rol = rol.toLowerCase();
    }
  }

  // Si hay errores, retornar respuesta de validación
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validación fallida.',
      errors,
    });
  }

  next();
};

/**
 * Validación de actualización de usuario (Admin)
 * Similar a validateUpdateProfile pero más permisivo para admins
 */
const validateUpdateUser = (req, res, next) => {
  const { nombre, email, rol, contrasena } = req.body;
  const errors = {};

  // Validación de nombre (opcional)
  if (nombre !== undefined) {
    const sanitizedNombre = sanitizeString(nombre);
    if (sanitizedNombre && !PATTERNS.nombre.test(sanitizedNombre)) {
      errors.nombre = ERROR_MESSAGES.nombre.invalid;
    } else if (sanitizedNombre) {
      req.body.nombre = sanitizedNombre;
    }
  }

  // Validación de email (opcional)
  if (email !== undefined) {
    const sanitizedEmail = sanitizeString(email).toLowerCase();
    if (sanitizedEmail && !PATTERNS.email.test(sanitizedEmail)) {
      errors.email = ERROR_MESSAGES.email.invalid;
    } else if (sanitizedEmail) {
      req.body.email = sanitizedEmail;
    }
  }

  // Validación de rol (opcional)
  if (rol !== undefined) {
    if (!PATTERNS.rol.test(rol)) {
      errors.rol = ERROR_MESSAGES.rol.invalid;
    } else {
      req.body.rol = rol.toLowerCase();
    }
  }

  // Validación de contraseña (opcional)
  if (contrasena !== undefined) {
    if (!PATTERNS.contrasena.test(contrasena)) {
      errors.contrasena = ERROR_MESSAGES.contrasena.invalid;
    } else {
      const passwordStrength = validatePasswordStrength(contrasena);
      if (!passwordStrength.isStrong) {
        errors.contrasena = ERROR_MESSAGES.contrasena.weak;
      }
    }
  }

  // Si hay errores, retornar respuesta de validación
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validación fallida.',
      errors,
    });
  }

  next();
};

/**
 * Middleware para validar ID de parámetro
 */
const validateUserId = (req, res, next) => {
  const { id } = req.params;

  // Validar que sea un número
  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: 'ID de usuario inválido.',
      errors: { id: 'El ID debe ser un número válido.' },
    });
  }

  req.params.id = parseInt(id, 10);
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateUpdateUser,
  validateUserId,
  validatePasswordStrength,
  sanitizeString,
};
