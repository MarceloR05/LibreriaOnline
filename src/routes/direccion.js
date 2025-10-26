import express from 'express';
import {
  getAllDirecciones,
  getDireccionById,
  getDireccionesByUsuario,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
} from '../services/direccionServices.js';
import { validateDireccionData } from '../middlewares/validateDireccionData.js';

const router = express.Router();

// Obtener todas las direcciones
router.get('/', getAllDirecciones);

// Obtener dirección por ID
router.get('/:id_direccion', getDireccionById);

// Obtener direcciones de un usuario
router.get('/usuario/:id_usuario', getDireccionesByUsuario);

// Crear dirección → middleware de validación
router.post('/', validateDireccionData, crearDireccion);

// Actualizar dirección → middleware de validación
router.put('/:id_direccion', validateDireccionData, actualizarDireccion);

// Eliminar dirección
router.delete('/:id_direccion', eliminarDireccion);

export default router;
