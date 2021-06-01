import { BOOLEAN, NUMBER, STRING, UUIDV4 } from 'sequelize';
import { sequelize } from './postgresql';

export const UserData = sequelize.define(
  'user',
  {
    id: { type: UUIDV4, primaryKey: true },
    login: { type: STRING, allowNull: false },
    password: { type: STRING, allowNull: false },
    age: {
      type: NUMBER,
      allowNull: false,
      get() {
        return parseInt(this.getDataValue('age'));
      },
    },
    isDeleted: { type: BOOLEAN, allowNull: false },
  },
  {
    timestamps: false,
    tableName: 'users',
  },
);
