const { body, param, validationResult } = require('express-validator');

const validateCreateOrder = [body('paymentIntentId').optional().trim()];

const validateUpdateOrderStatus = [
  param('id').isInt().withMessage('Invalid order ID'),
  body('orderStatus')
    .notEmpty()
    .withMessage('Order status is required')
    .isIn(['pending', 'shipped', 'delivered'])
    .withMessage('Invalid order status'),
];

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

module.exports = { validateCreateOrder, validateUpdateOrderStatus, handleValidation };
