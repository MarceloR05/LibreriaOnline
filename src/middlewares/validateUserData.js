// Middleware para validar datos de usuario antes de crear o actualizar
export const validateUserData = (req, res, next) => {
  const { nombre_usuario, email, contrasena_hash } = req.body;

  // Validar que todos los campos existan
  if (!nombre_usuario || !email || !contrasena_hash) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan campos obligatorios: nombre_usuario, email o contrasena_hash.'
    });
  }

  // Validar formato básico de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'El formato del correo electrónico no es válido.'
    });
  }

  // Si todo está bien, continuar al siguiente middleware o controlador
  next();
};
