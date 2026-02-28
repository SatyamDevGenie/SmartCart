const { Cart, CartItem, Product, Category } = require('../models');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        include: [{ model: Product, include: [{ model: Category, attributes: ['id', 'name'] }] }],
      },
    ],
  });
  if (!cart) {
    cart = await Cart.create({ userId });
    cart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          include: [{ model: Product, include: [{ model: Category, attributes: ['id', 'name'] }] }],
        },
      ],
    });
  }
  return cart;
};

const addItem = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId);
  const product = await Product.findByPk(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (product.stock < quantity) {
    const err = new Error(`Insufficient stock. Available: ${product.stock}`);
    err.statusCode = 400;
    throw err;
  }
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    const newQty = item.quantity + quantity;
    if (product.stock < newQty) {
      const err = new Error(`Insufficient stock. Available: ${product.stock}`);
      err.statusCode = 400;
      throw err;
    }
    await item.update({ quantity: newQty });
  } else {
    item = await CartItem.create({ cartId: cart.id, productId, quantity });
  }
  return getOrCreateCart(userId);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
    include: [Product],
  });
  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }
  if (item.Product.stock < quantity) {
    const err = new Error(`Insufficient stock. Available: ${item.Product.stock}`);
    err.statusCode = 400;
    throw err;
  }
  await item.update({ quantity });
  return getOrCreateCart(userId);
};

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }
  await item.destroy();
  return getOrCreateCart(userId);
};

module.exports = { getOrCreateCart, addItem, updateItemQuantity, removeItem };
