import { UUIDV4 } from 'sequelize';
import { sequelize } from '../data-access/postgresql';
import { IBasicItem } from '../types/common';

const UsersGroups = sequelize.define(
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

export class UsersGroupModel {
  async addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<void | string> {
    try {
      await sequelize.transaction(async (t) => {
        const relations = [];

        for (const userID of userIDs) {
          relations.push(
            await UsersGroups.create(
              {
                group: id,
                user: userID,
              },
              { transaction: t },
            ),
          );
        }

        return relations;
      });
    } catch (e) {
      return e.message;
    }
  }
}

export const usersGroupModel = new UsersGroupModel();
