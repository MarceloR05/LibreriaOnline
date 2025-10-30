import { pool } from '../db.js';

// Middleware de autenticación para validar que el usuario esté logueado
export const authenticateUser = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token de autenticación requerido',
        message: 'Debes iniciar sesión para realizar esta acción'
      });
    }

    // Extraer el token (formato: "Bearer token" o solo "token")
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de autenticación inválido',
        message: 'Debes iniciar sesión para realizar esta acción'
      });
    }

    // Validar formato del token simulado (token-{userId}-{timestamp})
    const tokenParts = token.split('-');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'token') {
      return res.status(401).json({ 
        error: 'Formato de token inválido',
        message: 'Sesión inválida, por favor inicia sesión nuevamente'
      });
    }

    const userId = parseInt(tokenParts[1]);
    const timestamp = parseInt(tokenParts[2]);

    // Validar que el userId sea un número válido
    if (isNaN(userId) || isNaN(timestamp)) {
      return res.status(401).json({ 
        error: 'Token malformado',
        message: 'Sesión inválida, por favor inicia sesión nuevamente'
      });
    }

    // Verificar que el usuario existe en la base de datos
    const userResult = await pool.query(
      'SELECT id_usuario, nombre_usuario, email, es_administrador FROM usuario WHERE id_usuario = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado',
        message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }

    // Validar que el token no sea muy antiguo (opcional - 24 horas)
    const now = Date.now();
    const tokenAge = now - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas en millisegundos

    if (tokenAge > maxAge) {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }

    // Agregar la información del usuario a la request
    req.user = userResult.rows[0];
    req.userId = userId;
    req.token = token;

    // Continuar al siguiente middleware o controlador
    next();

  } catch (error) {
    console.error('❌ Error en middleware de autenticación:', error.message);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al validar la autenticación'
    });
  }
};

// Middleware opcional para verificar si el usuario es administrador
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Autenticación requerida',
      message: 'Debes iniciar sesión para realizar esta acción'
    });
  }

  if (!req.user.es_administrador) {
    return res.status(403).json({ 
      error: 'Acceso denegado',
      message: 'Solo los administradores pueden realizar esta acción'
    });
  }

  next();
};