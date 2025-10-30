import express from 'express';
import {
  getAllItemsCarrito,
  getItemCarritoById,
  getItemsByCarrito,
  crearItemCarrito,
  actualizarItemCarrito,
  actualizarCantidadItem,
  eliminarItemCarrito
} from '../services/itemCarritoServices.js';

import { validateItemCarritoData } from '../middlewares/validateItemCarritoData.js';
import { validateCantidadUpdate } from '../middlewares/validateCantidadUpdate.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = express.Router();

// Rutas públicas (solo para administradores o casos específicos)
// Obtener todos los items
router.get('/', getAllItemsCarrito);

// Obtener item por ID
router.get('/:id_item', getItemCarritoById);

// Rutas que requieren autenticación
// Obtener items por carrito (requiere estar logueado)
router.get('/carrito/:id_carrito', authenticateUser, getItemsByCarrito);

// Crear item → requiere autenticación y validación
router.post('/', authenticateUser, validateItemCarritoData, crearItemCarrito);

// Actualizar item → requiere autenticación y validación
router.put('/:id_item', authenticateUser, validateItemCarritoData, actualizarItemCarrito);

// Actualizar solo cantidad → requiere autenticación y validación específica
router.patch('/:id_item/cantidad', authenticateUser, validateCantidadUpdate, actualizarCantidadItem);

// Eliminar item → requiere autenticación
router.delete('/:id_item', authenticateUser, eliminarItemCarrito);

export default router;
