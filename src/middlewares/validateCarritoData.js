export const validateCarritoData = (req, res, next) => {
  const { id_usuario, fecha_creacion, estado } = req.body;

  // Validar id_usuario
  if (!id_usuario || typeof id_usuario !== 'number') {
    return res.status(400).json({ error: 'id_usuario es obligatorio y debe ser un número' });
  }

  // Validar fecha_creacion (opcional)
  if (fecha_creacion && isNaN(Date.parse(fecha_creacion))) {
    return res.status(400).json({ error: 'fecha_creacion debe ser una fecha válida' });
  }

  // Validar estado (opcional)
  if (estado && typeof estado !== 'string') {
    return res.status(400).json({ error: 'estado debe ser un texto' });
  }

  next();
};
