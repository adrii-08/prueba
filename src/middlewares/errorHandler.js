/**
 * Clase personalizada para errores de la API.
 * Permite lanzar errores con un statusCode específico.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de manejo de errores.
 * Captura errores operacionales y de Prisma, devolviendo respuestas JSON consistentes.
 */
function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Errores de Prisma
  if (err.code === 'P2002') {
    statusCode = 409;
    const campo = err.meta?.target?.join(', ') || 'campo';
    message = `Ya existe un registro con ese valor en: ${campo}`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Registro no encontrado';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Referencia inválida: el registro relacionado no existe';
  }

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', {
      statusCode,
      message,
      stack: err.stack,
      code: err.code,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = { AppError, errorHandler };
