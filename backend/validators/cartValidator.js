const { body, param, validationResult } = require('express-validator');

const validateAddToCart = [
  body('productId').notEmpty().withMessage('Product ID is required').isInt().withMessage('Invalid product ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
];

const validateUpdateCartItem = [
  param('itemId').isInt().withMessage('Invalid cart item ID'),
  body('quantity').notEmpty().withMessage('Quantity is required').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
];

const validateCartItemId = [param('itemId').isInt().withMessage('Invalid cart item ID')];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validateAddToCart, validateUpdateCartItem, validateCartItemId, handleValidation };
