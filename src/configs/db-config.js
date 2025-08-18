const { Sequelize } = require('sequelize');
require('dotenv').config();

// Kết nối bằng URL
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,            // Clever Cloud yêu cầu SSL
      rejectUnauthorized: false // Bỏ qua self-signed cert
    }
  },
  logging: false,
});

module.exports = sequelize;
