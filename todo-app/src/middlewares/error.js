const ApiError = require('../utils/ApiError');

module.exports = (err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Internal Server Error' });
};