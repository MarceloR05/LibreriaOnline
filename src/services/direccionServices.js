import { pool } from '../db.js';

// Obtener todas las direcciones
export const getAllDirecciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM direccion ORDER BY id_direccion ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllDirecciones:', error.message);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

// Obtener dirección por ID
export const getDireccionById = async (req, res) => {
  try {
    const { id_direccion } = req.params;
    const result = await pool.query('SELECT * FROM direccion WHERE id_direccion = $1', [id_direccion]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Dirección no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getDireccionById:', error.message);
    res.status(500).json({ error: 'Error al buscar dirección' });
  }
};

// Obtener direcciones por usuario
export const getDireccionesByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const result = await pool.query('SELECT * FROM direccion WHERE id_usuario = $1', [id_usuario]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getDireccionesByUsuario:', error.message);
    res.status(500).json({ error: 'Error al obtener direcciones del usuario' });
  }
};

// Crear nueva dirección
export const crearDireccion = async (req, res) => {
  try {
    const { id_usuario, calle, ciudad, codigo_postal, pais } = req.body;

    if (!id_usuario || !calle || !ciudad || !codigo_postal || !pais) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO direccion (id_usuario, calle, ciudad, codigo_postal, pais)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, calle, ciudad, codigo_postal, pais]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearDireccion:', error.message);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

// Actualizar dirección
export const actualizarDireccion = async (req, res) => {
  try {
    const { id_direccion } = req.params;
    const { id_usuario, calle, ciudad, codigo_postal, pais } = req.body;

    const result = await pool.query(
      `UPDATE direccion
       SET id_usuario = $1, calle = $2, ciudad = $3, codigo_postal = $4, pais = $5
       WHERE id_direccion = $6 RETURNING *`,
      [id_usuario, calle, ciudad, codigo_postal, pais, id_direccion]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Dirección no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarDireccion:', error.message);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  }
};

// Eliminar dirección
export const eliminarDireccion = async (req, res) => {
  try {
    const { id_direccion } = req.params;
    const result = await pool.query('DELETE FROM direccion WHERE id_direccion = $1 RETURNING *', [id_direccion]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Dirección no encontrada' });
    res.json({ message: 'Dirección eliminada correctamente', direccion: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarDireccion:', error.message);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  }
};
