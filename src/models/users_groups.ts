import { Model, ModelCtor } from 'sequelize';
import { sequelize } from '../data-access/postgresql';
import { IBasicItem } from '../types/common';
import { OpenUsersGroupsProps } from '../types/users_groups';

export default class UsersGroupModel {
  constructor(protected sequelizeModel: ModelCtor<Model<OpenUsersGroupsProps>>) {}

  addUsersToGroup(
    id: IBasicItem['id'],
    userIDs: IBasicItem['id'][],
  ): Promise<Model<OpenUsersGroupsProps>[]> {
    return sequelize.transaction(async (t) => {
      const relations = [];

      for (const userID of userIDs) {
        relations.push(
          await this.sequelizeModel.create(
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
