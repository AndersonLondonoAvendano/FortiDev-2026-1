const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

/**
 * Registro de usuario
 * POST /api/auth/register
 * @param {string} nombre - Nombre completo del usuario
 * @param {string} email - Email único del usuario
 * @param {string} rol - Rol del usuario (admin, dev, analista)
 * @param {string} contrasena - Contraseña hasheada por bcrypt
 */
const register = async (req, res) => {
  const { nombre, email, rol, contrasena } = req.body;

  // Nota: La validación ya se hace en el middleware
  // Solo hacer validaciones adicionales específicas de BD aquí

  try {
    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'El email ya está registrado.',
        errors: { email: 'Este correo electrónico ya está en uso.' },
      });
    }

    // Hash de la contraseña con salt rounds = 10
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario en la BD
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, email, rol, contrasena) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, created_at',
      [nombre, email, rol, hashedPassword]
    );

    const user = newUser.rows[0];
    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      message: 'Error en el servidor al registrar usuario.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 * @param {string} email - Email del usuario
 * @param {string} contrasena - Contraseña del usuario (sin hashear)
 */
const login = async (req, res) => {
  const { email, contrasena } = req.body;

  // Nota: La validación ya se hace en el middleware

  try {
    // Buscar usuario por email
    const userQuery = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (userQuery.rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciales inválidas.',
        errors: { credentials: 'El email o la contraseña no son correctos.' },
      });
    }

    const user = userQuery.rows[0];

    // Comparar contraseñas con bcrypt
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas.',
        errors: { credentials: 'El email o la contraseña no son correctos.' },
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error en el servidor al iniciar sesión.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, nombre, email, rol, created_at, updated_at FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      message: 'Perfil obtenido exitosamente.',
      user: user.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  const { nombre, email, rol } = req.body;
  const userId = req.user.id;

  try {
    // Si el email está siendo actualizado, verificar que no esté en uso
    if (email) {
      const existingEmail = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email, userId]
      );
      if (existingEmail.rows.length > 0) {
        return res.status(409).json({
          message: 'Email ya está en uso.',
          errors: { email: 'Este correo electrónico ya está registrado.' },
        });
      }
    }

    // Construir query dinámicamente solo con los campos enviados
    let query = 'UPDATE usuarios SET';
    let values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      query += ` nombre = $${paramIndex}`;
      values.push(nombre);
      paramIndex++;
    }

    if (email !== undefined) {
      if (values.length > 0) query += ',';
      query += ` email = $${paramIndex}`;
      values.push(email);
      paramIndex++;
    }

    if (rol !== undefined) {
      if (values.length > 0) query += ',';
      query += ` rol = $${paramIndex}`;
      values.push(rol);
      paramIndex++;
    }

    // Si no hay campos para actualizar
    if (values.length === 0) {
      return res.status(400).json({
        message: 'No hay campos para actualizar.',
      });
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, nombre, email, rol, updated_at`;
    values.push(userId);

    const updatedUser = await pool.query(query, values);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      message: 'Perfil actualizado exitosamente.',
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Obtener todos los usuarios (Admin)
 * GET /api/auth/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, nombre, email, rol, created_at, updated_at FROM usuarios ORDER BY created_at DESC'
    );

    res.json({
      message: 'Usuarios obtenidos exitosamente.',
      count: users.rows.length,
      users: users.rows,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Obtener usuario por ID
 * GET /api/auth/:id
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await pool.query(
      'SELECT id, nombre, email, rol, created_at, updated_at FROM usuarios WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      message: 'Usuario obtenido exitosamente.',
      user: user.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Actualizar usuario (Admin)
 * PUT /api/auth/:id
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, contrasena } = req.body;

  try {
    // Si el email está siendo actualizado, verificar que no esté en uso
    if (email) {
      const existingEmail = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (existingEmail.rows.length > 0) {
        return res.status(409).json({
          message: 'Email ya está en uso.',
          errors: { email: 'Este correo electrónico ya está registrado.' },
        });
      }
    }

    // Construir query dinámicamente
    let query = 'UPDATE usuarios SET';
    let values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      query += ` nombre = $${paramIndex}`;
      values.push(nombre);
      paramIndex++;
    }

    if (email !== undefined) {
      if (values.length > 0) query += ',';
      query += ` email = $${paramIndex}`;
      values.push(email);
      paramIndex++;
    }

    if (rol !== undefined) {
      if (values.length > 0) query += ',';
      query += ` rol = $${paramIndex}`;
      values.push(rol);
      paramIndex++;
    }

    if (contrasena !== undefined) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      if (values.length > 0) query += ',';
      query += ` contrasena = $${paramIndex}`;
      values.push(hashedPassword);
      paramIndex++;
    }

    // Si no hay campos para actualizar
    if (values.length === 0) {
      return res.status(400).json({
        message: 'No hay campos para actualizar.',
      });
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, nombre, email, rol, updated_at`;
    values.push(id);

    const updatedUser = await pool.query(query, values);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      message: 'Usuario actualizado exitosamente.',
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Eliminar usuario
 * DELETE /api/auth/:id
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, email, rol',
      [id]
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      message: 'Usuario eliminado exitosamente.',
      user: deletedUser.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      message: 'Error en el servidor.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { register, login, getProfile, updateProfile, getAllUsers, getUserById, updateUser, deleteUser };