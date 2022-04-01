const { DataTypes } = require('sequelize');

const sequelize = require('./connection');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
