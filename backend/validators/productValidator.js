const { body, query, param, validationResult } = require('express-validator');

const validateCreateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 255 }),
  body('description').optional().trim(),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0.01 }).withMessage('Price must be positive'),
  body('stock').notEmpty().withMessage('Stock is required').isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('categoryId').notEmpty().withMessage('Category is required').isInt().withMessage('Invalid category ID'),
];

const validateUpdateProduct = [
  param('id').isInt().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('price').optional().isFloat({ min: 0.01 }),
  body('stock').optional().isInt({ min: 0 }),
  body('categoryId').optional().isInt(),
];

const validateProductQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('categoryId').optional().isInt().toInt(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
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

module.exports = { validateCreateProduct, validateUpdateProduct, validateProductQuery, handleValidation };
