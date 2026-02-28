/**
 * One-time script to create an admin user.
 * Run from backend folder: node scripts/createAdmin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Cart } = require('../models');

const email = process.env.ADMIN_EMAIL || 'admin@smartshop.com';
const password = process.env.ADMIN_PASSWORD || 'Admin@123';
const name = process.env.ADMIN_NAME || 'Admin';

async function createAdmin() {
  try {
    await sequelize.authenticate();
    const existing = await User.scope('withPassword').findOne({ where: { email } });
    if (existing) {
      console.log('Admin user already exists:', email);
      process.exit(0);
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'admin' });
    await Cart.create({ userId: user.id });
    console.log('Admin created:', email);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

createAdmin();
