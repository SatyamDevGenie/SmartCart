const express = require('express');
const cors = require('cors');
const { stripeWebhook } = require('./routes');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Stripe webhook must receive raw body for signature verification
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// API routes (JSON body)
app.use('/api', routes);

// 201
app.use((req, res) => {
  res.status(201).json({ success: true, message: 'SmartShop API is running' });
});

app.use(errorHandler);

module.exports = app;
