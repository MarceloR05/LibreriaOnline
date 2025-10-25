import { pool } from '../db.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM usuario ORDER BY id_usuario ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getAllUsers:', error.message);
    next(error);
  }
};


// Buscar usuario por email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getUserByEmail:', error.message);
    res.status(500).json({ error: 'Error al buscar usuario por email' });
  }
};

// Buscar usuario por nombre
export const getUserByName = async (req, res) => {
  try {
    const { nombre } = req.params;
    const result = await pool.query('SELECT * FROM usuario WHERE nombre_usuario ILIKE $1', [`%${nombre}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en getUserByName:', error.message);
    res.status(500).json({ error: 'Error al buscar usuario por nombre' });
  }
};

// Crear nuevo usuario
export const postCrearUsuario = async (req, res) => {
  try {
    const { nombre_usuario, email, contrasena_hash, es_administrador } = req.body;
    const result = await pool.query(
      `INSERT INTO usuario (nombre_usuario, email, contrasena_hash, es_administrador)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre_usuario, email, contrasena_hash, es_administrador || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en postCrearUsuario:', error.message);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nombre_usuario, email, contrasena_hash, es_administrador } = req.body;

    const result = await pool.query(
      `UPDATE usuario
       SET nombre_usuario = $1, email = $2, contrasena_hash = $3, es_administrador = $4
       WHERE id_usuario = $5 RETURNING *`,
      [nombre_usuario, email, contrasena_hash, es_administrador, id_usuario]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en actualizarUsuario:', error.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const result = await pool.query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id_usuario]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('❌ Error en eliminarUsuario:', error.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Buscar usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const result = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en getUserById:', error.message);
    res.status(500).json({ error: 'Error al buscar usuario por ID' });
  }
};

// Filtrar usuarios por parámetros dinámicos (nombre, email, admin)
export const filtrarUsuarios = async (req, res) => {
  try {
    const { nombre, email, es_administrador } = req.query;

    let query = 'SELECT * FROM usuario WHERE 1=1';
    const params = [];

    if (nombre) {
      params.push(`%${nombre}%`);
      query += ` AND nombre_usuario ILIKE $${params.length}`;
    }

    if (email) {
      params.push(`%${email}%`);
      query += ` AND email ILIKE $${params.length}`;
    }

    if (es_administrador !== undefined) {
      params.push(es_administrador === 'true');
      query += ` AND es_administrador = $${params.length}`;
    }

    query += ' ORDER BY id_usuario ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en filtrarUsuarios:', error.message);
    res.status(500).json({ error: 'Error al filtrar usuarios' });
  }
};
