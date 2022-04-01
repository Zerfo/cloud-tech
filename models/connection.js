const { Sequelize } = require('sequelize');

const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    operatorsAliases: 'false',
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = sequelize;
