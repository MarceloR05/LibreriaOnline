export const validateDireccionData = (req, res, next) => {
  const { id_usuario, calle, ciudad, codigo_postal, pais } = req.body;

  if (!id_usuario || typeof id_usuario !== 'number') {
    return res.status(400).json({ error: 'id_usuario es obligatorio y debe ser un número' });
  }

  if (!calle || typeof calle !== 'string') {
    return res.status(400).json({ error: 'calle es obligatoria y debe ser un texto' });
  }

  if (!ciudad || typeof ciudad !== 'string') {
    return res.status(400).json({ error: 'ciudad es obligatoria y debe ser un texto' });
  }

  if (!codigo_postal || typeof codigo_postal !== 'string') {
    return res.status(400).json({ error: 'codigo_postal es obligatorio y debe ser un texto' });
  }

  if (!pais || typeof pais !== 'string') {
    return res.status(400).json({ error: 'pais es obligatorio y debe ser un texto' });
  }

  next();
};
