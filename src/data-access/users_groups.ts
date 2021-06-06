import { sequelize } from './postgresql';
import { UUIDV4 } from 'sequelize';

export const UsersGroupsData = sequelize.define(
  'users_groups',
  {
    user: { type: UUIDV4, allowNull: false },
    group: { type: UUIDV4, primaryKey: true },
  },
  {
    timestamps: false,
    tableName: 'users_groups',
  },
);
