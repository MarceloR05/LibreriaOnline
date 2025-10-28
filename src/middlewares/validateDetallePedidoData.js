export const validateDetallePedidoData = (req, res, next) => {
  const { id_pedido, id_libro, cantidad, precio_unitario } = req.body;

  // Validar id_pedido (INT)
  if (!id_pedido || typeof id_pedido !== 'number' || id_pedido <= 0) {
    return res.status(400).json({ error: 'id_pedido es obligatorio y debe ser un número entero positivo' });
  }

  // Validar id_libro (INT)
  if (!id_libro || typeof id_libro !== 'number' || id_libro <= 0) {
    return res.status(400).json({ error: 'id_libro es obligatorio y debe ser un número entero positivo' });
  }

  // Validar cantidad (INT)
  if (!cantidad || typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: 'cantidad es obligatoria y debe ser un número entero positivo' });
  }

  // Validar precio_unitario (DECIMAL)
  if (!precio_unitario || typeof precio_unitario !== 'number' || precio_unitario < 0) {
    return res.status(400).json({ error: 'precio_unitario es obligatorio y debe ser un número positivo o cero' });
  }

  next();
};