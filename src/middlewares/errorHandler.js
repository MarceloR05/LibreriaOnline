// Middleware centralizado para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por middleware:', err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
  });
};
