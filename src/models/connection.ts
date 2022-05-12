import { Sequelize } from 'sequelize';

import { DB_CONFIG } from '../configs';

export const connection = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    timezone: '+00:00',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: false,
    },
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 20,
      min: 5,
    },
  },
);
