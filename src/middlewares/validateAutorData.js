export const validateAutorData = (req, res, next) => {
  const { nombre, biografia } = req.body;

  // Validar nombre (VARCHAR)
  if (!nombre || typeof nombre !== 'string' || nombre.length === 0) {
    return res.status(400).json({ error: 'nombre es obligatorio y debe ser un texto no vacío' });
  }

  // Validar biografia (TEXT, opcional)
  if (biografia && typeof biografia !== 'string') {
    return res.status(400).json({ error: 'biografia debe ser un texto' });
  }

  next();
};