export const validateLibroData = (req, res, next) => {
  const { titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria } = req.body;

  // Validar titulo (VARCHAR)
  if (!titulo || typeof titulo !== 'string' || titulo.length === 0) {
    return res.status(400).json({ error: 'titulo es obligatorio y debe ser un texto no vacío' });
  }

  // Validar isbn (VARCHAR)
  if (!isbn || typeof isbn !== 'string' || isbn.length === 0) {
    return res.status(400).json({ error: 'isbn es obligatorio y debe ser un texto no vacío' });
  }

  // Validar stock (INT)
  if (stock === undefined || typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: 'stock es obligatorio y debe ser un número entero no negativo' });
  }

  // Validar precio (DECIMAL)
  if (precio === undefined || typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({ error: 'precio es obligatorio y debe ser un número no negativo' });
  }

  // Validar descripcion (TEXT, opcional)
  if (descripcion && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'descripcion debe ser un texto' });
  }

  // Validar fecha_publicacion (DATE, opcional)
  if (fecha_publicacion && isNaN(Date.parse(fecha_publicacion))) {
    return res.status(400).json({ error: 'fecha_publicacion debe ser una fecha válida' });
  }

  // Validar id_autor (INT)
  if (!id_autor || typeof id_autor !== 'number' || id_autor <= 0) {
    return res.status(400).json({ error: 'id_autor es obligatorio y debe ser un número entero positivo' });
  }

  // Validar id_categoria (INT)
  if (!id_categoria || typeof id_categoria !== 'number' || id_categoria <= 0) {
    return res.status(400).json({ error: 'id_categoria es obligatorio y debe ser un número entero positivo' });
  }

  next();
};