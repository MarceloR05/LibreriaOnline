import { pool } from '../db.js';

export const validateItemCarritoData = async (req, res, next) => {
  try {
    let { id_carrito, id_libro, cantidad, precio_unitario } = req.body;

    // Convertir strings a números si es necesario
    if (typeof id_carrito === 'string') id_carrito = parseInt(id_carrito);
    if (typeof id_libro === 'string') id_libro = parseInt(id_libro);
    if (typeof cantidad === 'string') cantidad = parseInt(cantidad);
    if (typeof precio_unitario === 'string') precio_unitario = parseFloat(precio_unitario);

    // Actualizar req.body con los valores convertidos
    req.body.id_carrito = id_carrito;
    req.body.id_libro = id_libro;
    req.body.cantidad = cantidad;
    req.body.precio_unitario = precio_unitario;

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

    // Validar stock disponible
    const stockResult = await pool.query('SELECT stock, titulo FROM libro WHERE id_libro = $1', [id_libro]);
    
    if (stockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    const { stock, titulo } = stockResult.rows[0];
    
    if (stock < cantidad) {
      return res.status(400).json({ 
        error: `Stock insuficiente para "${titulo}". Solo quedan ${stock} unidades disponibles.`,
        stockDisponible: stock
      });
    }

    next();

  } catch (error) {
    console.error('❌ Error in validateItemCarritoData:', error);
    return res.status(500).json({ error: 'Error al validar datos del item' });
  }
};
