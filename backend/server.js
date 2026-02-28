require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { testConnection } = require('./config/db');
const { sequelize } = require('./models');

const start = async () => {
  await testConnection();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
