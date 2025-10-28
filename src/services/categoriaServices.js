import { pool } from '../db.js';

// Obtener todas las categorías
export const getAllCategorias = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY id_categoria ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllCategorias:', error.message);
    next(error);
  }
};

// Buscar categoría por ID
export const getCategoriaById = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const result = await pool.query('SELECT * FROM categoria WHERE id_categoria = $1', [id_categoria]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getCategoriaById:', error.message);
    res.status(500).json({ error: 'Error al buscar categoría por ID' });
  }
};

// Crear nueva categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      `INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING *`,
      [nombre, descripcion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearCategoria:', error.message);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      `UPDATE categoria
       SET nombre = $1, descripcion = $2
       WHERE id_categoria = $3
       RETURNING *`,
      [nombre, descripcion, id_categoria]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarCategoria:', error.message);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const result = await pool.query('DELETE FROM categoria WHERE id_categoria = $1 RETURNING *', [id_categoria]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada correctamente', categoria: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarCategoria:', error.message);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};