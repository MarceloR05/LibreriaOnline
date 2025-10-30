import { pool } from '../db.js';
import { getDireccionPredeterminada, crearDireccionPredeterminada } from './direccionServices.js';

// Obtener todos los pedidos
export const getAllPedidos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.nombre_usuario,
        u.email,
        json_build_object(
          'id_direccion', d.id_direccion,
          'calle', d.calle,
          'ciudad', d.ciudad,
          'codigo_postal', d.codigo_postal,
          'pais', d.pais,
          'es_predeterminada', d.es_predeterminada
        ) as direccion_envio,
        json_agg(
          CASE 
            WHEN dp.id_detalle IS NOT NULL THEN
              json_build_object(
                'id_detalle', dp.id_detalle,
                'id_libro', dp.id_libro,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario,
                'subtotal', dp.cantidad * dp.precio_unitario,
                'libro', json_build_object(
                  'id_libro', l.id_libro,
                  'titulo', l.titulo,
                  'precio', l.precio,
                  'autor', json_build_object(
                    'id_autor', a.id_autor,
                    'nombre', a.nombre
                  )
                )
              )
            ELSE NULL
          END
        ) FILTER (WHERE dp.id_detalle IS NOT NULL) as detalles
      FROM pedido p
      LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
      LEFT JOIN direccion d ON p.id_direccion_envio = d.id_direccion
      LEFT JOIN detallepedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN libro l ON dp.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      GROUP BY p.id_pedido, u.nombre_usuario, u.email, d.id_direccion, d.calle, d.ciudad, d.codigo_postal, d.pais, d.es_predeterminada
      ORDER BY p.id_pedido DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllPedidos:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*,
        u.nombre_usuario,
        u.email,
        json_build_object(
          'id_direccion', d.id_direccion,
          'calle', d.calle,
          'ciudad', d.ciudad,
          'codigo_postal', d.codigo_postal,
          'pais', d.pais,
          'es_predeterminada', d.es_predeterminada
        ) as direccion_envio,
        json_agg(
          CASE 
            WHEN dp.id_detalle IS NOT NULL THEN
              json_build_object(
                'id_detalle', dp.id_detalle,
                'id_libro', dp.id_libro,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario,
                'subtotal', dp.cantidad * dp.precio_unitario,
                'libro', json_build_object(
                  'id_libro', l.id_libro,
                  'titulo', l.titulo,
                  'precio', l.precio,
                  'autor', json_build_object(
                    'id_autor', a.id_autor,
                    'nombre', a.nombre
                  )
                )
              )
            ELSE NULL
          END
        ) FILTER (WHERE dp.id_detalle IS NOT NULL) as detalles
      FROM pedido p
      LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
      LEFT JOIN direccion d ON p.id_direccion_envio = d.id_direccion
      LEFT JOIN detallepedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN libro l ON dp.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      WHERE p.id_pedido = $1
      GROUP BY p.id_pedido, u.nombre_usuario, u.email, d.id_direccion, d.calle, d.ciudad, d.codigo_postal, d.pais, d.es_predeterminada
    `, [id_pedido]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getPedidoById:', error.message);
    res.status(500).json({ error: 'Error al buscar pedido' });
  }
};

// Crear nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { id_usuario, total, id_direccion_envio, estado_pedido } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const result = await pool.query(
      `INSERT INTO pedido (id_usuario, total, id_direccion_envio, estado_pedido)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, total || 0, id_direccion_envio || null, estado_pedido || 'Confirmado']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearPedido:', error.message);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Finalizar compra: crear pedido desde carrito y vaciarlo
export const finalizarCompra = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    // 1. Verificar/Crear dirección predeterminada
    let direccionEnvio = await getDireccionPredeterminada(id_usuario);
    
    if (!direccionEnvio) {
      direccionEnvio = await crearDireccionPredeterminada(id_usuario);
    }

    // 2. Obtener carrito del usuario
    const carritoResult = await client.query(
      'SELECT * FROM carrito WHERE id_usuario = $1 ORDER BY fecha_creacion DESC LIMIT 1',
      [id_usuario]
    );

    if (carritoResult.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró carrito para el usuario' });
    }

    const carrito = carritoResult.rows[0];

    // 3. Obtener items del carrito
    const itemsResult = await client.query(
      'SELECT * FROM itemcarrito WHERE id_carrito = $1',
      [carrito.id_carrito]
    );

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const items = itemsResult.rows;

    // 4. Calcular total
    const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);

    // 5. Crear pedido con dirección predeterminada
    const pedidoResult = await client.query(
      `INSERT INTO pedido (id_usuario, total, id_direccion_envio, estado_pedido, fecha_pedido)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, total, direccionEnvio.id_direccion, 'Confirmado', new Date()]
    );

    const pedido = pedidoResult.rows[0];

    // 6. Verificar stock disponible antes de proceder
    for (const item of items) {
      const stockResult = await client.query(
        'SELECT stock FROM libro WHERE id_libro = $1',
        [item.id_libro]
      );
      
      if (stockResult.rows.length === 0) {
        throw new Error(`Libro con ID ${item.id_libro} no encontrado`);
      }
      
      const stockActual = stockResult.rows[0].stock;
      if (stockActual < item.cantidad) {
        throw new Error(`Stock insuficiente para el libro ID ${item.id_libro}. Stock disponible: ${stockActual}, cantidad solicitada: ${item.cantidad}`);
      }
    }

    // 7. Crear detalles del pedido
    for (const item of items) {
      await client.query(
        `INSERT INTO detallepedido (id_pedido, id_libro, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id_pedido, item.id_libro, item.cantidad, item.precio_unitario]
      );
    }

    // 8. Reducir stock de los libros comprados
    for (const item of items) {
      const updateResult = await client.query(
        `UPDATE libro SET stock = stock - $1 WHERE id_libro = $2 RETURNING id_libro, stock`,
        [item.cantidad, item.id_libro]
      );
    }

    // 9. Vaciar carrito (eliminar items)
    await client.query('DELETE FROM itemcarrito WHERE id_carrito = $1', [carrito.id_carrito]);

    // 10. Obtener pedido completo con detalles y dirección de envío
    const pedidoCompleto = await client.query(`
      SELECT 
        p.*,
        json_build_object(
          'id_direccion', d.id_direccion,
          'calle', d.calle,
          'ciudad', d.ciudad,
          'codigo_postal', d.codigo_postal,
          'pais', d.pais,
          'es_predeterminada', d.es_predeterminada
        ) as direccion_envio,
        json_agg(
          json_build_object(
            'id_detalle', dp.id_detalle,
            'id_libro', dp.id_libro,
            'cantidad', dp.cantidad,
            'precio_unitario', dp.precio_unitario,
            'subtotal', dp.cantidad * dp.precio_unitario,
            'libro', json_build_object(
              'id_libro', l.id_libro,
              'titulo', l.titulo,
              'precio', l.precio
            )
          )
        ) as detalles
      FROM pedido p
      LEFT JOIN direccion d ON p.id_direccion_envio = d.id_direccion
      LEFT JOIN detallepedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN libro l ON dp.id_libro = l.id_libro
      WHERE p.id_pedido = $1
      GROUP BY p.id_pedido, d.id_direccion, d.calle, d.ciudad, d.codigo_postal, d.pais, d.es_predeterminada
    `, [pedido.id_pedido]);

    await client.query('COMMIT');
    
    res.status(201).json(pedidoCompleto.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en finalizarCompra:', error.message);
    res.status(500).json({ error: 'Error al finalizar la compra' });
  } finally {
    client.release();
  }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { id_usuario, total, id_direccion_envio, estado_pedido } = req.body;

    const result = await pool.query(
      `UPDATE pedido
       SET id_usuario = $1,
           total = $2,
           id_direccion_envio = $3,
           estado_pedido = $4
       WHERE id_pedido = $5
       RETURNING *`,
      [id_usuario, total, id_direccion_envio, estado_pedido, id_pedido]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarPedido:', error.message);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};

// Actualizar solo el estado del pedido (para admin)
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { estado_pedido, estado } = req.body;
    
    // Usar estado_pedido o estado, lo que venga
    const nuevoEstado = estado_pedido || estado;
    
    if (!nuevoEstado) {
      return res.status(400).json({ error: 'Se requiere estado_pedido o estado' });
    }

    const result = await pool.query(
      `UPDATE pedido
       SET estado_pedido = $1
       WHERE id_pedido = $2
       RETURNING *`,
      [nuevoEstado, id_pedido]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarEstadoPedido:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const result = await pool.query('DELETE FROM pedido WHERE id_pedido = $1 RETURNING *', [id_pedido]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json({ message: 'Pedido eliminado correctamente', pedido: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarPedido:', error.message);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
};

// Obtener pedidos por usuario con detalles completos
export const getPedidosByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Obtener pedidos del usuario con detalles y dirección
    const pedidosResult = await pool.query(`
      SELECT 
        p.*,
        json_build_object(
          'id_direccion', d.id_direccion,
          'calle', d.calle,
          'ciudad', d.ciudad,
          'codigo_postal', d.codigo_postal,
          'pais', d.pais,
          'es_predeterminada', d.es_predeterminada
        ) as direccion_envio,
        json_agg(
          CASE 
            WHEN dp.id_detalle IS NOT NULL THEN
              json_build_object(
                'id_detalle', dp.id_detalle,
                'id_libro', dp.id_libro,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario,
                'subtotal', dp.cantidad * dp.precio_unitario,
                'libro', json_build_object(
                  'id_libro', l.id_libro,
                  'titulo', l.titulo,
                  'precio', l.precio,
                  'autor', json_build_object(
                    'nombre', a.nombre
                  )
                )
              )
            ELSE NULL
          END
        ) FILTER (WHERE dp.id_detalle IS NOT NULL) as detalles
      FROM pedido p
      LEFT JOIN direccion d ON p.id_direccion_envio = d.id_direccion
      LEFT JOIN detallepedido dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN libro l ON dp.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      WHERE p.id_usuario = $1
      GROUP BY p.id_pedido, d.id_direccion, d.calle, d.ciudad, d.codigo_postal, d.pais, d.es_predeterminada
      ORDER BY p.fecha_pedido DESC
    `, [id_usuario]);

    res.json(pedidosResult.rows);
  } catch (error) {
    console.error('❌ Error en getPedidosByUsuario:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
  }
};
