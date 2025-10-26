import { pool } from '../db.js';

// Obtener todos los pedidos
export const getAllPedidos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedido ORDER BY id_pedido ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllPedidos:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query('SELECT * FROM pedido WHERE id_pedido = $1', [id_pedido]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getPedidoById:', error.message);
    res.status(500).json({ error: 'Error al buscar pedido' });
  }
};

// Crear nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { id_usuario, total, id_direccion_envio, estado_pedido } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const result = await pool.query(
      `INSERT INTO pedido (id_usuario, total, id_direccion_envio, estado_pedido)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, total || 0, id_direccion_envio || null, estado_pedido || 'Pendiente']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearPedido:', error.message);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { id_usuario, total, id_direccion_envio, estado_pedido } = req.body;

    const result = await pool.query(
      `UPDATE pedido
       SET id_usuario = $1,
           total = $2,
           id_direccion_envio = $3,
           estado_pedido = $4
       WHERE id_pedido = $5
       RETURNING *`,
      [id_usuario, total, id_direccion_envio, estado_pedido, id_pedido]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarPedido:', error.message);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query('DELETE FROM pedido WHERE id_pedido = $1 RETURNING *', [id_pedido]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json({ message: 'Pedido eliminado correctamente', pedido: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarPedido:', error.message);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
};
