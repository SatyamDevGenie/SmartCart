const Stripe = require('stripe');
const config = require('../config');

const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey, { apiVersion: '2024-11-20.acacia' }) : null;

const createPaymentIntent = async (amountCents, orderId, metadata = {}) => {
  if (!stripe) {
    const err = new Error('Stripe is not configured');
    err.statusCode = 503;
    throw err;
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountCents),
    currency: 'usd',
    metadata: { orderId: String(orderId), ...metadata },
    automatic_payment_methods: { enabled: true },
  });
  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

const constructWebhookEvent = (payload, signature, secret) => {
  if (!config.stripe.webhookSecret || !secret) {
    const err = new Error('Webhook secret not configured');
    err.statusCode = 500;
    throw err;
  }
  return Stripe.webhooks.constructEvent(payload, signature, secret);
};

module.exports = { stripe, createPaymentIntent, constructWebhookEvent };
