export const validateCategoriaData = (req, res, next) => {
  const { nombre, descripcion } = req.body;

  // Validar nombre (VARCHAR)
  if (!nombre || typeof nombre !== 'string' || nombre.length === 0) {
    return res.status(400).json({ error: 'nombre es obligatorio y debe ser un texto no vacío' });
  }

  // Validar descripcion (TEXT, opcional)
  if (descripcion && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'descripcion debe ser un texto' });
  }

  next();
};