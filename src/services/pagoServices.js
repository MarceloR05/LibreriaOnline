import { pool } from '../db.js';

// Obtener todos los pagos
export const getAllPagos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pago ORDER BY id_pago ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllPagos:', error.message);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};

// Obtener pago por ID
export const getPagoById = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const result = await pool.query('SELECT * FROM pago WHERE id_pago = $1', [id_pago]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getPagoById:', error.message);
    res.status(500).json({ error: 'Error al buscar pago' });
  }
};

// Obtener pagos por pedido
export const getPagosByPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query('SELECT * FROM pago WHERE id_pedido = $1', [id_pedido]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getPagosByPedido:', error.message);
    res.status(500).json({ error: 'Error al obtener pagos por pedido' });
  }
};

// Crear nuevo pago
export const crearPago = async (req, res) => {
  try {
    const { id_pedido, monto, metodo_pago, estado_pago, referencia_transaccion } = req.body;

    if (!id_pedido || !monto || !metodo_pago) {
      return res.status(400).json({ error: 'id_pedido, monto y metodo_pago son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO pago (id_pedido, monto, metodo_pago, estado_pago, referencia_transaccion)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_pedido, monto, metodo_pago, estado_pago || 'Pendiente', referencia_transaccion || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearPago:', error.message);
    res.status(500).json({ error: 'Error al crear pago' });
  }
};

// Actualizar pago
export const actualizarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const { id_pedido, monto, metodo_pago, estado_pago, referencia_transaccion } = req.body;

    const result = await pool.query(
      `UPDATE pago
       SET id_pedido = $1,
           monto = $2,
           metodo_pago = $3,
           estado_pago = $4,
           referencia_transaccion = $5
       WHERE id_pago = $6 RETURNING *`,
      [id_pedido, monto, metodo_pago, estado_pago, referencia_transaccion, id_pago]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarPago:', error.message);
    res.status(500).json({ error: 'Error al actualizar pago' });
  }
};

// Eliminar pago
export const eliminarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const result = await pool.query('DELETE FROM pago WHERE id_pago = $1 RETURNING *', [id_pago]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json({ message: 'Pago eliminado correctamente', pago: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarPago:', error.message);
    res.status(500).json({ error: 'Error al eliminar pago' });
  }
};
