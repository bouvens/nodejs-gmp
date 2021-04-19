import { v4 as uuid } from 'uuid';
import { ENUM, STRING, UUIDV4 } from 'sequelize';
import { Group, permissionList, OpenGroupProps } from '../types';
import { sequelize } from '../data-access/postgresql';
import { getPlain } from './common';

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

export class GroupModel {
  static async add({ name, permissions }: OpenGroupProps): Promise<Group['id']> {
    const id = uuid();
    await Group.create({ id, name, permissions });
    return id;
  }

  static async findById(id: Group['id']): Promise<Group> {
    return Group.findOne({ where: { id } }).then(getPlain).catch(console.error);
  }

  static async findAll(): Promise<Group[] | void> {
    return Group.findAll({
      order: ['name'],
    })
      .then((users) => users.map(getPlain))
      .catch(console.error);
  }

  static async update(id: Group['id'], updates: Partial<Group>): Promise<Group> {
    return Group.findOne({ where: { id } })
      .then((user) => user.update(updates))
      .then(getPlain)
      .catch(console.error);
  }

  static async hardDelete(id: Group['id']): Promise<number> {
    return Group.destroy({ where: { id } });
  }
}

export type IGroupModel = typeof GroupModel;
