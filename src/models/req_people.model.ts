import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import {connection} from './connection';

export interface ReqPeople extends Model<InferAttributes<ReqPeople>, InferCreationAttributes<ReqPeople>> {
  id: CreationOptional<number>;
  date_end: Date;
  date_req: Date;
  date_start: Date;
  description: string;
  fio: string;
  is_approved: boolean;
}

export const REQ_PEOPLE_MODEL = connection.define<ReqPeople>('req_people', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
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
  }
});
