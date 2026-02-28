const express = require('express');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductQuery,
  handleValidation: handleProductValidation,
} = require('../validators/productValidator');
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
  handleValidation: handleCategoryValidation,
} = require('../validators/categoryValidator');
const { validateUpdateOrderStatus, handleValidation: handleOrderValidation } = require('../validators/orderValidator');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', validateUpdateOrderStatus, handleOrderValidation, adminController.updateOrderStatus);
router.get('/categories', adminController.getCategories);
router.post('/categories', validateCreateCategory, handleCategoryValidation, adminController.createCategory);
router.put('/categories/:id', validateUpdateCategory, handleCategoryValidation, adminController.updateCategory);
router.delete('/categories/:id', validateCategoryId, handleCategoryValidation, adminController.deleteCategory);
router.get('/products', validateProductQuery, handleProductValidation, productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', validateCreateProduct, handleProductValidation, productController.createProduct);
router.put('/products/:id', validateUpdateProduct, handleProductValidation, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
