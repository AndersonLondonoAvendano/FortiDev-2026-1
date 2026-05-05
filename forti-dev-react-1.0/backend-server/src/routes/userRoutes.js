const express = require('express');
const { register, login, getProfile, updateProfile, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateUpdateUser,
  validateUserId,
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rutas protegidas para usuarios autenticados
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, updateProfile);

// Rutas protegidas para administradores
router.get('/users', getAllUsers);
router.get('/:id', validateUserId, getUserById);
router.put('/:id', validateUserId, validateUpdateUser, updateUser);
router.delete('/:id', validateUserId, deleteUser);

module.exports = router;
