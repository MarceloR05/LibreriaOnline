import { pool } from '../db.js';

// Obtener todos los carritos
export const getAllCarritos = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM carrito ORDER BY id_carrito ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllCarritos:', error.message);
    next(error);
  }
};

// Buscar carrito por ID
export const getCarritoById = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const result = await pool.query('SELECT * FROM carrito WHERE id_carrito = $1', [id_carrito]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getCarritoById:', error.message);
    res.status(500).json({ error: 'Error al buscar carrito por ID' });
  }
};

// Buscar carrito por ID de usuario (o crear uno si no existe)
export const getCarritoByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const userIdFromParams = parseInt(id_usuario);
    
    // Verificar que el usuario autenticado solo pueda acceder a su propio carrito
    if (req.user && req.user.id_usuario !== userIdFromParams) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes acceder a tu propio carrito'
      });
    }
    
    // Buscar carrito del usuario (sin filtrar por estado ya que esa columna no existe)
    let result = await pool.query(
      'SELECT * FROM carrito WHERE id_usuario = $1 ORDER BY fecha_creacion DESC LIMIT 1', 
      [userIdFromParams]
    );
    
    if (result.rows.length === 0) {
      // Si no existe un carrito, crear uno nuevo (sin estado)
      const createResult = await pool.query(
        'INSERT INTO carrito (id_usuario, fecha_creacion) VALUES ($1, $2) RETURNING *',
        [userIdFromParams, new Date()]
      );
      result = createResult;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getCarritoByUsuario:', error.message);
    res.status(500).json({ error: 'Error al buscar carrito por usuario' });
  }
};

// Crear nuevo carrito
export const crearCarrito = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    // Verificar que el usuario autenticado solo pueda crear carritos para sí mismo
    if (req.user && req.user.id_usuario !== parseInt(id_usuario)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes crear carritos para tu propio usuario'
      });
    }

    const result = await pool.query(
      `INSERT INTO carrito (id_usuario) VALUES ($1) RETURNING *`,
      [id_usuario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearCarrito:', error.message);
    res.status(500).json({ error: 'Error al crear carrito' });
  }
};


// Actualizar carrito
export const actualizarCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const result = await pool.query(
      `UPDATE carrito
       SET id_usuario = $1, ultima_actualizacion = NOW()
       WHERE id_carrito = $2
       RETURNING *`,
      [id_usuario, id_carrito]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarCarrito:', error.message);
    res.status(500).json({ error: 'Error al actualizar carrito' });
  }
};


// Eliminar carrito
export const eliminarCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const result = await pool.query('DELETE FROM carrito WHERE id_carrito = $1 RETURNING *', [id_carrito]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json({ message: 'Carrito eliminado correctamente', carrito: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarCarrito:', error.message);
    res.status(500).json({ error: 'Error al eliminar carrito' });
  }
};
