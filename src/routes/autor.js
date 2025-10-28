import express from 'express';
import {
  getAllAutores,
  getAutorById,
  crearAutor,
  actualizarAutor,
  eliminarAutor
} from '../services/autorServices.js';

import { validateAutorData } from '../middlewares/validateAutorData.js';

const router = express.Router();

// Obtener todos los autores
router.get('/', getAllAutores);

// Buscar autor por ID
router.get('/buscarPorId/:id_autor', getAutorById);

// Crear nuevo autor → usamos el middleware
router.post('/', validateAutorData, crearAutor);

// Actualizar autor → usamos el middleware
router.put('/:id_autor', validateAutorData, actualizarAutor);

// Eliminar autor
router.delete('/:id_autor', eliminarAutor);

export default router;