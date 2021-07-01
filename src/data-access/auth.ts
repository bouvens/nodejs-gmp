import { UUIDV4, STRING } from 'sequelize';
import { sequelize } from './postgresql';

export const AuthData = sequelize.define(
  'auth',
  {
    user: { type: UUIDV4, primaryKey: true },
    token: { type: STRING, allowNull: false },
    ip: { type: STRING, allowNull: false },
  },
  {
    timestamps: true,
    tableName: 'auth',
  },
);
