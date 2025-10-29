// Middleware para validar datos de usuario antes de crear o actualizar
export const validateUserData = (req, res, next) => {
  const { nombre_usuario, email, contrasena_hash } = req.body;

  // Validar que todos los campos existan (para creación)
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

// Middleware para validar datos de usuario en actualización (campos opcionales)
export const validateUserUpdateData = (req, res, next) => {
  const { nombre_usuario, email, contrasena_hash } = req.body;

  console.log('🔍 Middleware validateUserUpdateData - Datos recibidos:', {
    nombre_usuario,
    email,
    contrasena_hash: contrasena_hash ? '***' : undefined
  });

  // Verificar que al menos un campo esté presente
  if (!nombre_usuario && !email && !contrasena_hash) {
    console.log('❌ No hay campos para actualizar');
    return res.status(400).json({
      status: 'error',
      message: 'Debe proporcionar al menos un campo para actualizar.'
    });
  }

  // Validar formato de email solo si se proporciona
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email no válido:', email);
      return res.status(400).json({
        status: 'error',
        message: 'El formato del correo electrónico no es válido.'
      });
    }
  }

  // Validar nombre_usuario solo si se proporciona
  if (nombre_usuario && nombre_usuario.trim().length < 2) {
    console.log('❌ Nombre de usuario muy corto:', nombre_usuario);
    return res.status(400).json({
      status: 'error',
      message: 'El nombre de usuario debe tener al menos 2 caracteres.'
    });
  }

  // Validar contraseña solo si se proporciona
  if (contrasena_hash && contrasena_hash.length < 6) {
    console.log('❌ Contraseña muy corta');
    return res.status(400).json({
      status: 'error',
      message: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }

  console.log('✅ Validación exitosa, continuando...');
  next();
};
