const orderService = require('../services/orderService');
const { success } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

const createOrder = asyncHandler(async (req, res) => {
  const createPaymentIntent = !!config.stripe.secretKey;
  const { order, clientSecret } = await orderService.createOrder(req.user.id, { createPaymentIntent });
  const data = { order };
  if (clientSecret) data.clientSecret = clientSecret;
  return success(res, 201, data, 'Order created');
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  return success(res, 200, orders, 'Orders fetched');
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(parseInt(req.params.id, 10), req.user.id);
  return success(res, 200, order, 'Order fetched');
});

module.exports = { createOrder, getMyOrders, getOrderById };
