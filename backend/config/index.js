require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || (isProd ? '' : 'dev-secret-change-in-production');

if (isProd && !process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in production. Set it in .env.');
}

module.exports = {
  port: process.env.PORT || 5000,
  jwt: {
    secret: jwtSecret || 'fallback-not-for-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
