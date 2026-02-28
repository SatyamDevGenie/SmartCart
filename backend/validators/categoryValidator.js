const { body, param, validationResult } = require('express-validator');

const validateCreateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 255 }),
];

const validateUpdateCategory = [
  param('id').isInt().withMessage('Invalid category ID'),
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 255 }),
];

const validateCategoryId = [param('id').isInt().withMessage('Invalid category ID')];

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

module.exports = { validateCreateCategory, validateUpdateCategory, validateCategoryId, handleValidation };
