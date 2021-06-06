import GroupModel from '../models/group';
import UsersGroupModel from '../models/users_groups';
import { IGroup, OpenGroupProps } from '../types';
import { IBasicItem } from '../types/common';
import CrudService from './crud';
import { wrapErrorsAndLog } from './error';

export default class GroupService extends CrudService<OpenGroupProps, GroupModel> {
  constructor(protected model: GroupModel, private relationModel: UsersGroupModel) {
    super(model);
  }

  @wrapErrorsAndLog
  async getAll(): Promise<IGroup[]> {
    const groups = await this.model.findAll();
    return groups || [];
  }

  @wrapErrorsAndLog
  async addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<number> {
    const userGroups = await this.relationModel.addUsersToGroup(id, userIDs);
    return userGroups.length;
  }
}
