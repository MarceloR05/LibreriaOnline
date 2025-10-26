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

const router = express.Router();

// Obtener todos los carritos
router.get('/', getAllCarritos);

// Buscar carrito por ID
router.get('/buscarPorId/:id_carrito', getCarritoById);

// Buscar carrito por usuario
router.get('/buscarPorUsuario/:id_usuario', getCarritoByUsuario);

// Crear nuevo carrito → usamos el middleware
router.post('/', validateCarritoData, crearCarrito);

// Actualizar carrito → usamos el middleware
router.put('/:id_carrito', validateCarritoData, actualizarCarrito);

// Eliminar carrito
router.delete('/:id_carrito', eliminarCarrito);

export default router;
