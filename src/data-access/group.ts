import { sequelize } from './postgresql';
import { ENUM, STRING, UUIDV4 } from 'sequelize';
import { permissionList } from '../types';

export const GroupData = sequelize.define(
  'group',
  {
    id: { type: UUIDV4, primaryKey: true },
    name: { type: STRING, allowNull: false },
    permissions: { type: ENUM(...permissionList), allowNull: false },
  },
  {
    timestamps: false,
    tableName: 'groups',
  },
);
