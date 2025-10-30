import express from 'express';
import {
  getAllPedidos,
  getPedidoById,
  crearPedido,
  actualizarPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  finalizarCompra,
  getPedidosByUsuario
} from '../services/pedidoServices.js';

import { validatePedidoData } from '../middlewares/validatePedidoData.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/', getAllPedidos);

// Obtener pedidos por usuario
router.get('/usuario/:id_usuario', getPedidosByUsuario);

// Obtener pedido por ID
router.get('/:id_pedido', getPedidoById);

// Crear nuevo pedido → middleware de validación
router.post('/', validatePedidoData, crearPedido);

// Finalizar compra (crear pedido desde carrito y vaciarlo)
router.post('/finalizar', finalizarCompra);

// Actualizar pedido → middleware de validación
router.put('/:id_pedido', validatePedidoData, actualizarPedido);

// Actualizar solo el estado del pedido (para admin, sin validación estricta)
router.patch('/:id_pedido/estado', actualizarEstadoPedido);

// Eliminar pedido
router.delete('/:id_pedido', eliminarPedido);

export default router;

