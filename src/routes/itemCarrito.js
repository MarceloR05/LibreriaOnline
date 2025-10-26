import express from 'express';
import {
  getAllItemsCarrito,
  getItemCarritoById,
  getItemsByCarrito,
  crearItemCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito
} from '../services/itemCarritoServices.js';

import { validateItemCarritoData } from '../middlewares/validateItemCarritodata.js';

const router = express.Router();

// Obtener todos los items
router.get('/', getAllItemsCarrito);

// Obtener item por ID
router.get('/:id_item', getItemCarritoById);

// Obtener items por carrito
router.get('/carrito/:id_carrito', getItemsByCarrito);

// Crear item → middleware de validación
router.post('/', validateItemCarritoData, crearItemCarrito);

// Actualizar item → middleware de validación
router.put('/:id_item', validateItemCarritoData, actualizarItemCarrito);

// Eliminar item
router.delete('/:id_item', eliminarItemCarrito);

export default router;
