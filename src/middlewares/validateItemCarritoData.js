export const validateItemCarritoData = (req, res, next) => {
  const { id_carrito, id_libro, cantidad, precio_unitario } = req.body;

  if (!id_carrito || typeof id_carrito !== 'number') {
    return res.status(400).json({ error: 'id_carrito es obligatorio y debe ser un número' });
  }

  if (!id_libro || typeof id_libro !== 'number') {
    return res.status(400).json({ error: 'id_libro es obligatorio y debe ser un número' });
  }

  if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ error: 'cantidad es obligatoria, debe ser un número y mayor a 0' });
  }

  if (precio_unitario !== undefined && typeof precio_unitario !== 'number') {
    return res.status(400).json({ error: 'precio_unitario debe ser un número' });
  }

  next();
};
