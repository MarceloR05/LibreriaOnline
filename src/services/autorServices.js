import { pool } from '../db.js';

// Obtener todos los autores
export const getAllAutores = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM autor ORDER BY id_autor ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllAutores:', error.message);
    next(error);
  }
};

// Buscar autor por ID
export const getAutorById = async (req, res) => {
  try {
    const { id_autor } = req.params;
    const result = await pool.query('SELECT * FROM autor WHERE id_autor = $1', [id_autor]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getAutorById:', error.message);
    res.status(500).json({ error: 'Error al buscar autor por ID' });
  }
};

// Crear nuevo autor
export const crearAutor = async (req, res) => {
  try {
    const { nombre, biografia } = req.body;

    const result = await pool.query(
      `INSERT INTO autor (nombre, biografia) VALUES ($1, $2) RETURNING *`,
      [nombre, biografia]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearAutor:', error.message);
    res.status(500).json({ error: 'Error al crear autor' });
  }
};

// Actualizar autor
export const actualizarAutor = async (req, res) => {
  try {
    const { id_autor } = req.params;
    const { nombre, biografia } = req.body;

    const result = await pool.query(
      `UPDATE autor
       SET nombre = $1, biografia = $2
       WHERE id_autor = $3
       RETURNING *`,
      [nombre, biografia, id_autor]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarAutor:', error.message);
    res.status(500).json({ error: 'Error al actualizar autor' });
  }
};

// Eliminar autor
export const eliminarAutor = async (req, res) => {
  try {
    const { id_autor } = req.params;
    const result = await pool.query('DELETE FROM autor WHERE id_autor = $1 RETURNING *', [id_autor]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Autor no encontrado' });
    res.json({ message: 'Autor eliminado correctamente', autor: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarAutor:', error.message);
    res.status(500).json({ error: 'Error al eliminar autor' });
  }
};