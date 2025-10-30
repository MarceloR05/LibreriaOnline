import { pool } from '../db.js';

// Obtener todos los items del carrito
export const getAllItemsCarrito = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itemcarrito ORDER BY id_item ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllItemsCarrito:', error.message);
    res.status(500).json({ error: 'Error al obtener items del carrito' });
  }
};

// Obtener item por ID
export const getItemCarritoById = async (req, res) => {
  try {
    const { id_item } = req.params;
    const result = await pool.query('SELECT * FROM itemcarrito WHERE id_item = $1', [id_item]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getItemCarritoById:', error.message);
    res.status(500).json({ error: 'Error al buscar item' });
  }
};

// Obtener items por carrito
export const getItemsByCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const result = await pool.query('SELECT * FROM itemcarrito WHERE id_carrito = $1', [id_carrito]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getItemsByCarrito:', error.message);
    res.status(500).json({ error: 'Error al obtener items por carrito' });
  }
};

// Crear nuevo item
export const crearItemCarrito = async (req, res) => {
  try {
    const { id_carrito, id_libro, cantidad, precio_unitario } = req.body;

    if (!id_carrito || !id_libro || !cantidad || !precio_unitario) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar que el carrito pertenece al usuario autenticado
    const carritoResult = await pool.query(
      'SELECT id_usuario FROM carrito WHERE id_carrito = $1',
      [id_carrito]
    );

    if (carritoResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Carrito no encontrado',
        message: 'El carrito especificado no existe'
      });
    }

    const carritoOwnerId = carritoResult.rows[0].id_usuario;
    if (req.user && req.user.id_usuario !== carritoOwnerId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes agregar items a tu propio carrito'
      });
    }

    const result = await pool.query(
      `INSERT INTO itemcarrito (id_carrito, id_libro, cantidad, precio_unitario)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_carrito, id_libro, cantidad, precio_unitario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearItemCarrito:', error.message);
    res.status(500).json({ error: 'Error al crear item del carrito' });
  }
};

// Actualizar solo la cantidad de un item
export const actualizarCantidadItem = async (req, res) => {
  try {
    const { id_item } = req.params;
    const { cantidad } = req.body;

    // Verificar que el item pertenece al carrito del usuario autenticado
    const itemResult = await pool.query(`
      SELECT ic.*, c.id_usuario 
      FROM itemcarrito ic 
      JOIN carrito c ON ic.id_carrito = c.id_carrito 
      WHERE ic.id_item = $1
    `, [id_item]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const itemOwnerId = itemResult.rows[0].id_usuario;
    if (req.user && req.user.id_usuario !== itemOwnerId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes modificar items de tu propio carrito'
      });
    }

    const result = await pool.query(
      `UPDATE itemcarrito SET cantidad = $1 WHERE id_item = $2 RETURNING *`,
      [cantidad, id_item]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarCantidadItem:', error.message);
    res.status(500).json({ error: 'Error al actualizar cantidad del item' });
  }
};

// Actualizar item
export const actualizarItemCarrito = async (req, res) => {
  try {
    const { id_item } = req.params;
    const { id_carrito, id_libro, cantidad, precio_unitario } = req.body;

    // Verificar que el item pertenece al carrito del usuario autenticado
    const itemResult = await pool.query(`
      SELECT ic.*, c.id_usuario 
      FROM itemcarrito ic 
      JOIN carrito c ON ic.id_carrito = c.id_carrito 
      WHERE ic.id_item = $1
    `, [id_item]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const itemOwnerId = itemResult.rows[0].id_usuario;
    if (req.user && req.user.id_usuario !== itemOwnerId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes modificar items de tu propio carrito'
      });
    }

    const result = await pool.query(
      `UPDATE itemcarrito
       SET id_carrito = $1,
           id_libro = $2,
           cantidad = $3,
           precio_unitario = $4
       WHERE id_item = $5 RETURNING *`,
      [id_carrito, id_libro, cantidad, precio_unitario, id_item]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarItemCarrito:', error.message);
    res.status(500).json({ error: 'Error al actualizar item del carrito' });
  }
};

// Eliminar item
export const eliminarItemCarrito = async (req, res) => {
  try {
    const { id_item } = req.params;

    // Verificar que el item pertenece al carrito del usuario autenticado
    const itemResult = await pool.query(`
      SELECT ic.*, c.id_usuario 
      FROM itemcarrito ic 
      JOIN carrito c ON ic.id_carrito = c.id_carrito 
      WHERE ic.id_item = $1
    `, [id_item]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const itemOwnerId = itemResult.rows[0].id_usuario;
    if (req.user && req.user.id_usuario !== itemOwnerId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puedes eliminar items de tu propio carrito'
      });
    }

    const result = await pool.query('DELETE FROM itemcarrito WHERE id_item = $1 RETURNING *', [id_item]);

    res.json({ message: 'Item eliminado correctamente', item: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarItemCarrito:', error.message);
    res.status(500).json({ error: 'Error al eliminar item del carrito' });
  }
};
