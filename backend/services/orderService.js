const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models');
const stripeService = require('./stripeService');

const createOrder = async (userId, options = {}) => {
  const cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, include: [Product] }],
  });
  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  let totalAmount = 0;
  const orderItemsPayload = [];
  for (const ci of cart.CartItems) {
    const product = ci.Product;
    if (product.stock < ci.quantity) {
      const err = new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}`);
      err.statusCode = 400;
      throw err;
    }
    const lineTotal = Number(product.price) * ci.quantity;
    totalAmount += lineTotal;
    orderItemsPayload.push({
      productId: product.id,
      quantity: ci.quantity,
      price: product.price,
    });
  }

  const t = await require('../models').sequelize.transaction();
  try {
    const order = await Order.create(
      {
        userId,
        totalAmount: totalAmount.toFixed(2),
        paymentStatus: 'pending',
        orderStatus: 'pending',
      },
      { transaction: t }
    );

    for (const item of orderItemsPayload) {
      await OrderItem.create(
        { orderId: order.id, productId: item.productId, quantity: item.quantity, price: item.price },
        { transaction: t }
      );
    }

    for (const ci of cart.CartItems) {
      await Product.decrement('stock', { by: ci.quantity, where: { id: ci.productId }, transaction: t });
    }

    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    let clientSecret = null;
    let paymentIntentId = null;
    if (options.createPaymentIntent && stripeService.stripe) {
      const amountCents = Math.round(totalAmount * 100);
      const { clientSecret: cs, paymentIntentId: piId } = await stripeService.createPaymentIntent(
        amountCents,
        order.id
      );
      clientSecret = cs;
      paymentIntentId = piId;
      await order.update({ stripePaymentIntentId: paymentIntentId }, { transaction: t });
    }

    await t.commit();
    const savedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });
    return { order: savedOrder, clientSecret, paymentIntentId };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const getMyOrders = async (userId) => {
  return Order.findAll({
    where: { userId },
    include: [{ model: OrderItem, include: [Product] }],
    order: [['createdAt', 'DESC']],
  });
};

const getOrderById = async (orderId, userId = null) => {
  const where = { id: orderId };
  if (userId) where.userId = userId;
  const order = await Order.findOne({
    where,
    include: [{ model: OrderItem, include: [Product] }, { model: User, attributes: ['id', 'name', 'email'] }],
  });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

const getAllOrders = async () => {
  return Order.findAll({
    include: [{ model: OrderItem, include: [Product] }, { model: User, attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
};

const updateOrderStatus = async (orderId, orderStatus) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  await order.update({ orderStatus });
  return order;
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
  const order = await Order.findByPk(orderId);
  if (!order) return null;
  await order.update({ paymentStatus });
  return order;
};

const findByPaymentIntentId = async (paymentIntentId) => {
  return Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  findByPaymentIntentId,
};
