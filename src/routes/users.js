import express from 'express';
import {
  getAllUsers,
  getUserByEmail,
  getUserByName,
  getUserById,
  postCrearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  filtrarUsuarios 
} from '../services/usersServices.js';

import { validateUserData } from '../middlewares/validateUserData.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Buscar por email
router.get('/buscarPorEmail/:email', getUserByEmail);

// Buscar por nombre
router.get('/buscarPorNombre/:nombre', getUserByName);

// Crear usuario
router.post('/', validateUserData, postCrearUsuario);

// Actualizar usuario
router.put('/:id_usuario', validateUserData, actualizarUsuario);

// Eliminar usuario
router.delete('/:id_usuario', eliminarUsuario);

// Buscar por ID
router.get('/buscarPorId/:id_usuario', getUserById);

// Filtro dinámico (por query params)
router.get('/filtrar', filtrarUsuarios);



export default router;
