/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Validation errors
  if (err.isJoi || err.name === 'ValidationError') {
    statusCode = 400;
    message = err.details ? err.details.map(d => d.message).join(', ') : err.message;
  }

  // Database errors
  if (err.name === 'QueryFailedError') {
    statusCode = 400;
    message = 'Database query failed';
  }

  // Not found errors
  if (err.name === 'EntityNotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
