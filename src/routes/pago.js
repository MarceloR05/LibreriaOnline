import express from 'express';
import {
  getAllPagos,
  getPagoById,
  getPagosByPedido,
  crearPago,
  actualizarPago,
  eliminarPago
} from '../services/pagoServices.js';
import { validatePagoData } from '../middlewares/validatePagoData.js';

const router = express.Router();

// Obtener todos los pagos
router.get('/', getAllPagos);

// Obtener pago por ID
router.get('/:id_pago', getPagoById);

// Obtener pagos por pedido
router.get('/pedido/:id_pedido', getPagosByPedido);

// Crear pago → middleware de validación
router.post('/', validatePagoData, crearPago);

// Actualizar pago → middleware de validación
router.put('/:id_pago', validatePagoData, actualizarPago);

// Eliminar pago
router.delete('/:id_pago', eliminarPago);

export default router;
