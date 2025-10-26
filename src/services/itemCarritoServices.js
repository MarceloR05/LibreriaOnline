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

// Actualizar item
export const actualizarItemCarrito = async (req, res) => {
  try {
    const { id_item } = req.params;
    const { id_carrito, id_libro, cantidad, precio_unitario } = req.body;

    const result = await pool.query(
      `UPDATE itemcarrito
       SET id_carrito = $1,
           id_libro = $2,
           cantidad = $3,
           precio_unitario = $4
       WHERE id_item = $5 RETURNING *`,
      [id_carrito, id_libro, cantidad, precio_unitario, id_item]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
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
    const result = await pool.query('DELETE FROM itemcarrito WHERE id_item = $1 RETURNING *', [id_item]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente', item: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarItemCarrito:', error.message);
    res.status(500).json({ error: 'Error al eliminar item del carrito' });
  }
};
