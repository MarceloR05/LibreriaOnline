import { pool } from '../db.js';

export const validateCantidadUpdate = async (req, res, next) => {
  try {
    let { cantidad } = req.body;

    // Convertir string a número si es necesario
    if (typeof cantidad === 'string') cantidad = parseInt(cantidad);

    // Actualizar req.body con el valor convertido
    req.body.cantidad = cantidad;

    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ error: 'cantidad es obligatoria, debe ser un número y mayor a 0' });
    }

    // Obtener información del item para validar stock
    const { id_item } = req.params;
    const itemResult = await pool.query(
      'SELECT ic.id_libro, l.stock, l.titulo FROM itemcarrito ic JOIN libro l ON ic.id_libro = l.id_libro WHERE ic.id_item = $1',
      [id_item]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    const { stock, titulo } = itemResult.rows[0];
    
    if (stock < cantidad) {
      return res.status(400).json({ 
        error: `Stock insuficiente para "${titulo}". Solo quedan ${stock} unidades disponibles.`,
        stockDisponible: stock
      });
    }

    next();

  } catch (error) {
    console.error('❌ Error in validateCantidadUpdate:', error);
    return res.status(500).json({ error: 'Error al validar cantidad' });
  }
};