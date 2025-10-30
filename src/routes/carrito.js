import express from 'express';
import {
  getAllCarritos,
  getCarritoById,
  getCarritoByUsuario,
  crearCarrito,
  actualizarCarrito,
  eliminarCarrito
} from '../services/carritoServices.js';

import { validateCarritoData } from '../middlewares/validateCarritoData.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = express.Router();

// Rutas públicas (solo para administradores)
// Obtener todos los carritos
router.get('/', getAllCarritos);

// Buscar carrito por ID
router.get('/buscarPorId/:id_carrito', getCarritoById);

// Rutas que requieren autenticación
// Buscar carrito por usuario → requiere autenticación
router.get('/buscarPorUsuario/:id_usuario', authenticateUser, getCarritoByUsuario);

// Crear nuevo carrito → requiere autenticación y validación
router.post('/', authenticateUser, validateCarritoData, crearCarrito);

// Actualizar carrito → requiere autenticación y validación
router.put('/:id_carrito', authenticateUser, validateCarritoData, actualizarCarrito);

// Eliminar carrito → requiere autenticación
router.delete('/:id_carrito', authenticateUser, eliminarCarrito);

export default router;
