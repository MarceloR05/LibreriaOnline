export const validatePedidoData = (req, res, next) => {
  const { id_usuario, estado_pedido, total, id_direccion_envio } = req.body;

  if (!id_usuario || typeof id_usuario !== 'number') {
    return res.status(400).json({ error: 'id_usuario es obligatorio y debe ser un número' });
  }

  if (total !== undefined && (typeof total !== 'number' || total < 0)) {
    return res.status(400).json({ error: 'total debe ser un número mayor o igual a 0' });
  }

  if (estado_pedido && typeof estado_pedido !== 'string') {
    return res.status(400).json({ error: 'estado_pedido debe ser un texto' });
  }

  if (id_direccion_envio !== undefined && typeof id_direccion_envio !== 'number') {
    return res.status(400).json({ error: 'id_direccion_envio debe ser un número' });
  }

  next();
};
