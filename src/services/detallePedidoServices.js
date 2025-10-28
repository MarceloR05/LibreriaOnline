import { pool } from '../db.js';

// Obtener todos los detalles de pedido
export const getAllDetallesPedido = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM detallepedido ORDER BY id_detalle ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllDetallesPedido:', error.message);
    next(error);
  }
};

// Buscar detalle de pedido por ID (PK)
export const getDetallePedidoById = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const result = await pool.query('SELECT * FROM detallepedido WHERE id_detalle = $1', [id_detalle]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Detalle de Pedido no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getDetallePedidoById:', error.message);
    res.status(500).json({ error: 'Error al buscar Detalle de Pedido por ID' });
  }
};

// Buscar detalles de pedido por ID de Pedido (FK)
export const getDetallesByPedidoId = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query('SELECT * FROM detallepedido WHERE id_pedido = $1 ORDER BY id_detalle ASC', [id_pedido]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Detalles de Pedido para el pedido dado no encontrados' });
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getDetallesByPedidoId:', error.message);
    res.status(500).json({ error: 'Error al buscar Detalles de Pedido por ID de Pedido' });
  }
};


// Crear nuevo detalle de pedido
export const crearDetallePedido = async (req, res) => {
  try {
    const { id_pedido, id_libro, cantidad, precio_unitario } = req.body;

    const result = await pool.query(
      `INSERT INTO detallepedido (id_pedido, id_libro, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_pedido, id_libro, cantidad, precio_unitario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearDetallePedido:', error.message);
    res.status(500).json({ error: 'Error al crear detalle de pedido' });
  }
};

// Actualizar detalle de pedido
export const actualizarDetallePedido = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const { id_pedido, id_libro, cantidad, precio_unitario } = req.body;

    const result = await pool.query(
      `UPDATE detallepedido
       SET id_pedido = $1, id_libro = $2, cantidad = $3, precio_unitario = $4
       WHERE id_detalle = $5
       RETURNING *`,
      [id_pedido, id_libro, cantidad, precio_unitario, id_detalle]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Detalle de Pedido no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarDetallePedido:', error.message);
    res.status(500).json({ error: 'Error al actualizar detalle de pedido' });
  }
};

// Eliminar detalle de pedido
export const eliminarDetallePedido = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const result = await pool.query('DELETE FROM detallepedido WHERE id_detalle = $1 RETURNING *', [id_detalle]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Detalle de Pedido no encontrado' });
    res.json({ message: 'Detalle de Pedido eliminado correctamente', detalle: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarDetallePedido:', error.message);
    res.status(500).json({ error: 'Error al eliminar detalle de pedido' });
  }
};