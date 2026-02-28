const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, Cart } = require('../models');

const SALT_ROUNDS = 10;

const register = async (name, email, password) => {
  const existing = await User.scope('withPassword').findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });
  await Cart.create({ userId: user.id });
  const token = generateToken(user);
  const u = user.toJSON();
  delete u.password;
  return { user: u, token };
};

const login = async (email, password) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const token = generateToken(user);
  const u = user.toJSON();
  delete u.password;
  return { user: u, token };
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

module.exports = { register, login };
