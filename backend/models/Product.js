const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image: { type: DataTypes.STRING(500), allowNull: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false, field: 'category_id', references: { model: 'categories', key: 'id' } },
  },
  {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Product;
