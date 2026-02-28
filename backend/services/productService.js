const { Op } = require('sequelize');
const config = require('../config');
const { Product, Category } = require('../models');

const getList = async (page = 1, limit = config.pagination?.defaultLimit || 10, filters = {}) => {
  const safeLimit = Math.min(limit, config.pagination?.maxLimit || 100);
  const offset = (page - 1) * safeLimit;
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price[Op.gte] = filters.minPrice;
    if (filters.maxPrice != null) where.price[Op.lte] = filters.maxPrice;
  }
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, attributes: ['id', 'name'] }],
    limit: safeLimit,
    offset,
    order: [['id', 'ASC']],
  });
  return {
    products: rows,
    pagination: {
      page,
      limit: safeLimit,
      total: count,
      totalPages: Math.ceil(count / safeLimit) || 1,
    },
  };
};

const getById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, attributes: ['id', 'name'] }],
  });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const create = async (data) => {
  const category = await Category.findByPk(data.categoryId);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return Product.create(data);
};

const update = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
  }
  await product.update(data);
  return product;
};

const remove = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  await product.destroy();
  return { deleted: true };
};

module.exports = { getList, getById, create, update, remove };
