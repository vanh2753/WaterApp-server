const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
     dialectOptions: {
      ssl: {
         require: true,              // bắt buộc dùng SSL
        rejectUnauthorized: false   // bỏ qua self-signed cert
      }
    },
    logging: false
});

module.exports = sequelize;
