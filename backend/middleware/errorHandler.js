const { error } = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return error(res, 400, 'Validation failed', messages);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 409, 'Resource already exists (e.g. duplicate email).');
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 400, 'Invalid reference (e.g. category or product not found).');
  }
  if (err.statusCode) {
    return error(res, err.statusCode, err.message, err.errors || null);
  }
  return error(res, 500, err.message || 'Internal server error');
};

module.exports = errorHandler;
