import { UUIDV4, Model } from 'sequelize';
import { sequelize } from '../data-access/postgresql';
import { IBasicItem } from '../types/common';
import { IGroup } from '../types';

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
  addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<Model<IGroup>[]> {
    return sequelize.transaction(async (t) => {
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
  }
}

export const usersGroupModel = new UsersGroupModel();
