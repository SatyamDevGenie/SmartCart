const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validateCreateOrder, handleValidation } = require('../validators/orderValidator');

const router = express.Router();

router.use(protect);

router.post('/', validateCreateOrder, handleValidation, orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
