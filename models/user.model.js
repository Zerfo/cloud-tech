const Sequelize = require('sequelize');

const sequelize = require('./connection');

module.exports = sequelize.define('user', {
  username: {
    type: Sequelize.TEXT,
  },
  first_name: {
    type: Sequelize.TEXT,
  },
  last_name: {
    type: Sequelize.TEXT,
  },
  role: {
    type: Sequelize.TEXT,
  },
  password: {
    type: Sequelize.TEXT,
  }
});
