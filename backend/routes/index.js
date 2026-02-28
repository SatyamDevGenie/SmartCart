const express = require('express');
const config = require('../config');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const stripeWebhookController = require('../controllers/stripeWebhookController');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'SmartShop API is running' });
});

// Safe for frontend: returns Stripe publishable key only (never the secret key)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      stripePublishableKey: config.stripe.publishableKey || null,
    },
  });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
module.exports.stripeWebhook = stripeWebhookController.handleWebhook;
