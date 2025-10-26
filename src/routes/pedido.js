import express from 'express';
import {
  getAllPedidos,
  getPedidoById,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} from '../services/pedidoServices.js';

import { validatePedidoData } from '../middlewares/validatePedidoData.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/', getAllPedidos);

// Obtener pedido por ID
router.get('/:id_pedido', getPedidoById);

// Crear nuevo pedido → middleware de validación
router.post('/', validatePedidoData, crearPedido);

// Actualizar pedido → middleware de validación
router.put('/:id_pedido', validatePedidoData, actualizarPedido);

// Eliminar pedido
router.delete('/:id_pedido', eliminarPedido);

export default router;

