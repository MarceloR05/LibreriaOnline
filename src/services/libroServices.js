import { pool } from '../db.js';

// Obtener todos los libros con información de autor y categoría
export const getAllLibros = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.*,
        json_build_object(
          'id_autor', a.id_autor,
          'nombre', a.nombre,
          'biografia', a.biografia
        ) as autor,
        json_build_object(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre,
          'descripcion', c.descripcion
        ) as categoria
      FROM libro l
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      ORDER BY l.id_libro ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllLibros:', error.message);
    next(error);
  }
};

// Buscar libro por ID con información completa
export const getLibroById = async (req, res) => {
  try {
    const { id_libro } = req.params;
    const result = await pool.query(`
      SELECT 
        l.*,
        json_build_object(
          'id_autor', a.id_autor,
          'nombre', a.nombre,
          'biografia', a.biografia
        ) as autor,
        json_build_object(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre,
          'descripcion', c.descripcion
        ) as categoria
      FROM libro l
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      WHERE l.id_libro = $1
    `, [id_libro]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getLibroById:', error.message);
    res.status(500).json({ error: 'Error al buscar libro por ID' });
  }
};

// Buscar libros por ID de Autor con información completa
export const getLibrosByAutor = async (req, res) => {
  try {
    const { id_autor } = req.params;
    const result = await pool.query(`
      SELECT 
        l.*,
        json_build_object(
          'id_autor', a.id_autor,
          'nombre', a.nombre,
          'biografia', a.biografia
        ) as autor,
        json_build_object(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre,
          'descripcion', c.descripcion
        ) as categoria
      FROM libro l
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      WHERE l.id_autor = $1 
      ORDER BY l.titulo ASC
    `, [id_autor]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'No se encontraron libros para este autor' });
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getLibrosByAutor:', error.message);
    res.status(500).json({ error: 'Error al buscar libros por autor' });
  }
};

// Buscar libros por ID de Categoría con información completa
export const getLibrosByCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const result = await pool.query(`
      SELECT 
        l.*,
        json_build_object(
          'id_autor', a.id_autor,
          'nombre', a.nombre,
          'biografia', a.biografia
        ) as autor,
        json_build_object(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre,
          'descripcion', c.descripcion
        ) as categoria
      FROM libro l
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      WHERE l.id_categoria = $1 
      ORDER BY l.titulo ASC
    `, [id_categoria]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'No se encontraron libros para esta categoría' });
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getLibrosByCategoria:', error.message);
    res.status(500).json({ error: 'Error al buscar libros por categoría' });
  }
};

// Obtener detalles de un libro (simula la función obtener_detalles())
export const obtenerDetalles = async (req, res) => {
  try {
    const { id_libro } = req.params;
    // Query que une Libro, Autor y Categoria para obtener detalles enriquecidos
    const query = `
      SELECT 
        l.*, 
        a.nombre AS nombre_autor, a.biografia,
        c.nombre AS nombre_categoria
      FROM 
        libro l
      JOIN 
        autor a ON l.id_autor = a.id_autor
      JOIN 
        categoria c ON l.id_categoria = c.id_categoria
      WHERE 
        l.id_libro = $1;
    `;
    const result = await pool.query(query, [id_libro]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en obtenerDetalles:', error.message);
    res.status(500).json({ error: 'Error al obtener detalles del libro' });
  }
};


// Crear nuevo libro
export const crearLibro = async (req, res) => {
  try {
    const { titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria } = req.body;

    const result = await pool.query(
      `INSERT INTO libro (titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en crearLibro:', error.message);
    res.status(500).json({ error: 'Error al crear libro' });
  }
};

// Actualizar libro
export const actualizarLibro = async (req, res) => {
  try {
    const { id_libro } = req.params;
    const { titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria } = req.body;

    const result = await pool.query(
      `UPDATE libro
       SET titulo = $1, isbn = $2, stock = $3, precio = $4, descripcion = $5, fecha_publicacion = $6, id_autor = $7, id_categoria = $8
       WHERE id_libro = $9
       RETURNING *`,
      [titulo, isbn, stock, precio, descripcion, fecha_publicacion, id_autor, id_categoria, id_libro]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarLibro:', error.message);
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
};

// Actualizar stock de un libro (basado en la función actualizar_stock(cantidad))
export const actualizarStock = async (req, res) => {
  try {
    const { id_libro } = req.params;
    const { cantidad } = req.body; // 'cantidad' puede ser positiva para aumentar o negativa para disminuir (como en la función del diagrama)

    if (cantidad === undefined || typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
      return res.status(400).json({ error: 'cantidad es obligatoria y debe ser un número entero' });
    }

    // Usamos el operador de suma para implementar la lógica de actualizar_stock(cantidad)
    const result = await pool.query(
      `UPDATE libro
       SET stock = stock + $1
       WHERE id_libro = $2
       RETURNING *`,
      [cantidad, id_libro]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    
    // Verificación adicional para asegurar que el stock no sea negativo (aunque se recomienda hacerlo a nivel de DB con CHECK constraint)
    if (result.rows[0].stock < 0) {
      // Revertir la operación si el stock queda negativo
      await pool.query('UPDATE libro SET stock = stock - $1 WHERE id_libro = $2', [cantidad, id_libro]);
      return res.status(400).json({ error: 'Operación cancelada: El stock no puede ser negativo' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarStock:', error.message);
    res.status(500).json({ error: 'Error al actualizar el stock del libro' });
  }
};

// Eliminar libro
export const eliminarLibro = async (req, res) => {
  try {
    const { id_libro } = req.params;
    const result = await pool.query('DELETE FROM libro WHERE id_libro = $1 RETURNING *', [id_libro]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado correctamente', libro: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarLibro:', error.message);
    // Nota: Si hay claves foráneas referenciando a este libro, el DELETE fallará con un error de DB.
    res.status(500).json({ error: 'Error al eliminar libro (verificar posibles referencias en detallepedido)' });
  }
};