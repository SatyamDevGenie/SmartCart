const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');
const { error } = require('../utils/ApiResponse');

const protect = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) {
      return error(res, 401, 'Not authorized. Please login.');
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.scope('withPassword').findByPk(decoded.id);
    if (!user) {
      return error(res, 401, 'User not found. Token invalid.');
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'Token expired. Please login again.');
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 401, 'Invalid token.');
    }
    next(err);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return error(res, 403, 'Access denied. Admin only.');
};

module.exports = { protect, adminOnly };
