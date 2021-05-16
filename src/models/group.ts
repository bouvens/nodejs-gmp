import { ENUM, STRING, UUIDV4 } from 'sequelize';
import { IGroup, permissionList, OpenGroupProps } from '../types';
import { sequelize } from '../data-access/postgresql';
import { getPlainAndFiltered } from './common';
import { CrudModel } from './crud';
import logger from '../logger';

const Group = sequelize.define(
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

export class GroupModel extends CrudModel<OpenGroupProps> {
  async findAll(): Promise<IGroup[] | void> {
    return this.sequelizeModel
      .findAll({
        order: ['name'],
      })
      .then((users) => users.map(getPlainAndFiltered))
      .catch((e) => {
        logger.error(e);
      });
  }
}

export const groupModel = new GroupModel(Group);
