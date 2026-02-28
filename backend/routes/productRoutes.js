const express = require('express');
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductQuery,
  handleValidation,
} = require('../validators/productValidator');

const router = express.Router();

router.get('/', validateProductQuery, handleValidation, productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', protect, adminOnly, validateCreateProduct, handleValidation, productController.createProduct);
router.put('/:id', protect, adminOnly, validateUpdateProduct, handleValidation, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;
