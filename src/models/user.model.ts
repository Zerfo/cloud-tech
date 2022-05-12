import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import {connection} from './connection';
import {REQ_PEOPLE_MODEL} from './req_people.model';
import {REQ_CAR_MODEL} from './req_car.model';

export enum EUserRoles {
  ROLE_ADMIN = 'ADMIN',
  ROLE_USER = 'USER',
  ROLE_SECURITY = 'SECURITY',
}

export interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<number>;
  username: string;
  first_name: string;
  last_name: string;
  role: EUserRoles;
  password: string;
}

export const USER_MODEL = connection.define<User>('user', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: EUserRoles.ROLE_USER,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  paranoid: true,
  deletedAt: 'destroyTime'
});

USER_MODEL.hasMany(REQ_PEOPLE_MODEL);
REQ_PEOPLE_MODEL.belongsTo(USER_MODEL);

USER_MODEL.hasMany(REQ_CAR_MODEL);
REQ_CAR_MODEL.belongsTo(USER_MODEL);
