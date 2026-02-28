# Stripe Webhook Setup

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli#install), run `stripe login`.
2. Forward to local server: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
3. Copy the webhook signing secret (`whsec_...`) into `.env` as `STRIPE_WEBHOOK_SECRET`.
4. Restart the backend. Pay with test card `4242 4242 4242 4242`; `payment_intent.succeeded` will set order to `paid`.

Production: In Stripe Dashboard add endpoint `https://your-domain.com/api/webhooks/stripe`, events `payment_intent.succeeded`, `payment_intent.payment_failed`, use its signing secret in `.env`.
