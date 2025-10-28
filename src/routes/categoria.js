import express from 'express';
import {
  getAllCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../services/categoriaServices.js';

import { validateCategoriaData } from '../middlewares/validateCategoriaData.js';

const router = express.Router();

// Obtener todas las categorías
router.get('/', getAllCategorias);

// Buscar categoría por ID
router.get('/buscarPorId/:id_categoria', getCategoriaById);

// Crear nueva categoría → usamos el middleware
router.post('/', validateCategoriaData, crearCategoria);

// Actualizar categoría → usamos el middleware
router.put('/:id_categoria', validateCategoriaData, actualizarCategoria);

// Eliminar categoría
router.delete('/:id_categoria', eliminarCategoria);

export default router;