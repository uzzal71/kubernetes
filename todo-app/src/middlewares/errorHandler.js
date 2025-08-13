/**
 * Global Error Handler
 * --------------------
 * Captures and formats all errors in a unified response structure.
 */

const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // If no status code is set, default to 500
  if (!statusCode) {
    statusCode = 500;
  }

  // If in production, hide internal stack traces unless explicitly allowed
  const response = {
    status: 'error',
    code: statusCode,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : message,
  };

  // Add stack trace in development for debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
