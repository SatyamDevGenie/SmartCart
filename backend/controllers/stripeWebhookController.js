const stripeService = require('../services/stripeService');
const orderService = require('../services/orderService');
const config = require('../config');

const handleWebhook = async (req, res) => {
  if (!config.stripe.webhookSecret || config.stripe.webhookSecret.trim() === '') {
    return res.status(503).json({
      success: false,
      message: 'Webhook not configured. Add STRIPE_WEBHOOK_SECRET to .env (see docs/STRIPE_WEBHOOK.md).',
    });
  }
  const signature = req.headers['stripe-signature'];
  const rawBody = req.body;
  if (!rawBody || !signature) {
    return res.status(400).json({ success: false, message: 'Missing signature or body' });
  }
  let event;
  try {
    event = stripeService.constructWebhookEvent(rawBody, signature, config.stripe.webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const order = await orderService.findByPaymentIntentId(paymentIntent.id);
        if (order && order.paymentStatus !== 'paid') {
          await orderService.updatePaymentStatus(order.id, 'paid');
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const order = await orderService.findByPaymentIntentId(paymentIntent.id);
        if (order) {
          await orderService.updatePaymentStatus(order.id, 'failed');
        }
        break;
      }
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ success: false, message: 'Webhook handler failed' });
  }
};

module.exports = { handleWebhook };
