import express from 'express';
import {
  getAllLibros,
  getLibroById,
  getLibrosByAutor,
  getLibrosByCategoria,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  obtenerDetalles,
  actualizarStock
} from '../services/libroServices.js';

import { validateLibroData } from '../middlewares/validateLibroData.js';

const router = express.Router();

// Obtener todos los libros
router.get('/', getAllLibros);

// Buscar libro por ID
router.get('/buscarPorId/:id_libro', getLibroById);

// Buscar libros por ID de Autor
router.get('/buscarPorAutor/:id_autor', getLibrosByAutor);

// Buscar libros por ID de Categoría
router.get('/buscarPorCategoria/:id_categoria', getLibrosByCategoria);

// Obtener detalles de un libro (asume que llama a una función que trae datos relacionados)
router.get('/detalles/:id_libro', obtenerDetalles);

// Crear nuevo libro → usamos el middleware
router.post('/', validateLibroData, crearLibro);

// Actualizar libro → usamos el middleware
router.put('/:id_libro', validateLibroData, actualizarLibro);

// Actualizar stock de un libro (puedes crear un middleware más específico para esto si es necesario)
router.patch('/actualizarStock/:id_libro', actualizarStock);

// Eliminar libro
router.delete('/:id_libro', eliminarLibro);

export default router;