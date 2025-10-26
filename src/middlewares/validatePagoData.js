export const validatePagoData = (req, res, next) => {
  const { id_pedido, monto, metodo_pago, estado_pago, referencia_transaccion } = req.body;

  if (!id_pedido || typeof id_pedido !== 'number') {
    return res.status(400).json({ error: 'id_pedido es obligatorio y debe ser un número' });
  }

  if (monto === undefined || typeof monto !== 'number' || monto <= 0) {
    return res.status(400).json({ error: 'monto es obligatorio, debe ser un número y mayor a 0' });
  }

  if (!metodo_pago || typeof metodo_pago !== 'string') {
    return res.status(400).json({ error: 'metodo_pago es obligatorio y debe ser un texto' });
  }

  if (estado_pago && typeof estado_pago !== 'string') {
    return res.status(400).json({ error: 'estado_pago debe ser un texto' });
  }

  if (referencia_transaccion && typeof referencia_transaccion !== 'string') {
    return res.status(400).json({ error: 'referencia_transaccion debe ser un texto' });
  }

  next();
};
