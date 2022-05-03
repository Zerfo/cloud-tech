const { Sequelize } = require('sequelize');

const config = require('../config/database');

module.exports = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  operatorsAliases: 'false',
  pool: {
    acquire: 30000,
    idle: 10000,
    max: 20,
    min: 5,
  }
});
