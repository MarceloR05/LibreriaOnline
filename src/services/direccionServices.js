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

// Obtener dirección predeterminada del usuario
export const getDireccionPredeterminada = async (id_usuario) => {
  try {
    const result = await pool.query(
      'SELECT * FROM direccion WHERE id_usuario = $1 AND es_predeterminada = true LIMIT 1',
      [id_usuario]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error en getDireccionPredeterminada:', error.message);
    throw error;
  }
};

// Crear dirección predeterminada automática
export const crearDireccionPredeterminada = async (id_usuario) => {
  try {
    // Verificar si ya tiene dirección predeterminada
    const direccionExistente = await getDireccionPredeterminada(id_usuario);
    if (direccionExistente) {
      return direccionExistente;
    }

    // Crear dirección predeterminada básica
    const result = await pool.query(
      `INSERT INTO direccion (id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [id_usuario, 'Dirección sin especificar', 'Ciudad sin especificar', '00000', 'País sin especificar']
    );

    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en crearDireccionPredeterminada:', error.message);
    throw error;
  }
};

// Establecer dirección como predeterminada
export const establecerDireccionPredeterminada = async (req, res) => {
  try {
    const { id_direccion } = req.params;
    const { id_usuario } = req.body;

    // Quitar predeterminada de todas las direcciones del usuario
    await pool.query(
      'UPDATE direccion SET es_predeterminada = false WHERE id_usuario = $1',
      [id_usuario]
    );

    // Establecer la nueva dirección como predeterminada
    const result = await pool.query(
      'UPDATE direccion SET es_predeterminada = true WHERE id_direccion = $1 RETURNING *',
      [id_direccion]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en establecerDireccionPredeterminada:', error.message);
    res.status(500).json({ error: 'Error al establecer dirección predeterminada' });
  }
};

// Crear nueva dirección
export const crearDireccion = async (req, res) => {
  try {
    const { id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada = false } = req.body;

    if (!id_usuario || !calle || !ciudad || !codigo_postal || !pais) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Si se marca como predeterminada, quitar predeterminada de otras direcciones
    if (es_predeterminada) {
      await pool.query(
        'UPDATE direccion SET es_predeterminada = false WHERE id_usuario = $1',
        [id_usuario]
      );
    }

    const result = await pool.query(
      `INSERT INTO direccion (id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearDireccion:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

// Actualizar dirección
export const actualizarDireccion = async (req, res) => {
  try {
    const { id_direccion } = req.params;
    const { id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada = false } = req.body;

    // Si se marca como predeterminada, quitar predeterminada de otras direcciones
    if (es_predeterminada) {
      await pool.query(
        'UPDATE direccion SET es_predeterminada = false WHERE id_usuario = $1',
        [id_usuario]
      );
    }

    const result = await pool.query(
      `UPDATE direccion
       SET id_usuario = $1, calle = $2, ciudad = $3, codigo_postal = $4, pais = $5, es_predeterminada = $6
       WHERE id_direccion = $7 RETURNING *`,
      [id_usuario, calle, ciudad, codigo_postal, pais, es_predeterminada, id_direccion]
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
