import express from 'express';
import {
  getAllDetallesPedido,
  getDetallePedidoById,
  getDetallesByPedidoId,
  crearDetallePedido,
  actualizarDetallePedido,
  eliminarDetallePedido
} from '../services/detallePedidoServices.js';

import { validateDetallePedidoData } from '../middlewares/validateDetallePedidoData.js';

const router = express.Router();

// Obtener todos los detalles de pedido
router.get('/', getAllDetallesPedido);

// Buscar detalle de pedido por ID (PK: id_detalle)
router.get('/buscarPorId/:id_detalle', getDetallePedidoById);

// Buscar detalles de pedido por ID de Pedido (FK: id_pedido)
router.get('/buscarPorPedido/:id_pedido', getDetallesByPedidoId);

// Crear nuevo detalle de pedido → usamos el middleware
router.post('/', validateDetallePedidoData, crearDetallePedido);

// Actualizar detalle de pedido → usamos el middleware
router.put('/:id_detalle', validateDetallePedidoData, actualizarDetallePedido);

// Eliminar detalle de pedido
router.delete('/:id_detalle', eliminarDetallePedido);

export default router;