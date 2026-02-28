const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id', references: { model: 'users', key: 'id' } },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'total_amount' },
    paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed'), allowNull: false, defaultValue: 'pending', field: 'payment_status' },
    orderStatus: { type: DataTypes.ENUM('pending', 'shipped', 'delivered'), allowNull: false, defaultValue: 'pending', field: 'order_status' },
    stripePaymentIntentId: { type: DataTypes.STRING(255), field: 'stripe_payment_intent_id' },
  },
  {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Order;
