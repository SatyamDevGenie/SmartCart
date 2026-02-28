const cartService = require('../services/cartService');
const { success } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user.id);
  return success(res, 200, cart, 'Cart fetched');
});

const addToCart = asyncHandler(async (req, res) => {
  const productId = parseInt(req.body.productId, 10);
  const quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;
  const cart = await cartService.addItem(req.user.id, productId, quantity);
  return success(res, 201, cart, 'Item added to cart');
});

const updateCartItem = asyncHandler(async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const quantity = parseInt(req.body.quantity, 10);
  const cart = await cartService.updateItemQuantity(req.user.id, itemId, quantity);
  return success(res, 200, cart, 'Cart updated');
});

const removeFromCart = asyncHandler(async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const cart = await cartService.removeItem(req.user.id, itemId);
  return success(res, 200, cart, 'Item removed from cart');
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
