import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import {connection} from './connection';

export interface ReqCar extends Model<InferAttributes<ReqCar>, InferCreationAttributes<ReqCar>> {
  id: CreationOptional<number>;
  car_number: string;
  date_end: Date;
  date_req: Date;
  date_start: Date;
  description: string;
  fio: string;
  is_approved: boolean;
  passengers: string[];
  w_passengers: boolean;
  wo_wcreening: boolean;
}

export const REQ_CAR_MODEL = connection.define<ReqCar>('req_car', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
  },
  car_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_req:{
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_start:{
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  fio: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  passengers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  wo_wcreening: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  w_passengers: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
