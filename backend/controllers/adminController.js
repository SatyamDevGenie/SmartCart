const { Order, User } = require('../models');
const orderService = require('../services/orderService');
const { success } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { Category } = require('../models');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, revenueResult] = await Promise.all([
    User.count(),
    Order.count(),
    Order.sum('totalAmount', { where: { paymentStatus: 'paid' } }),
  ]);
  const totalRevenue = revenueResult || 0;
  return success(res, 200, {
    totalUsers,
    totalOrders,
    totalRevenue: Number(totalRevenue).toFixed(2),
  }, 'Dashboard stats');
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  return success(res, 200, orders, 'All orders');
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const { orderStatus } = req.body;
  const order = await orderService.updateOrderStatus(orderId, orderStatus);
  return success(res, 200, order, 'Order status updated');
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  return success(res, 201, category, 'Category created');
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const category = await Category.findByPk(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  await category.update({ name: req.body.name });
  return success(res, 200, category, 'Category updated');
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const category = await Category.findByPk(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  await category.destroy();
  return success(res, 200, null, 'Category deleted');
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  return success(res, 200, categories, 'Categories fetched');
});

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
