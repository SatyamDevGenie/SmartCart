const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const {
  validateAddToCart,
  validateUpdateCartItem,
  validateCartItemId,
  handleValidation,
} = require('../validators/cartValidator');

const router = express.Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', validateAddToCart, handleValidation, cartController.addToCart);
router.put('/items/:itemId', validateUpdateCartItem, handleValidation, cartController.updateCartItem);
router.delete('/items/:itemId', validateCartItemId, handleValidation, cartController.removeFromCart);

module.exports = router;
