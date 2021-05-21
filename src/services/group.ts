import { GroupModel } from '../models/group';
import { usersGroupModel } from '../models/users_groups';
import { IGroup, OpenGroupProps } from '../types';
import { IBasicItem } from '../types/common';
import CrudService from './crud';
import { wrapErrorsAndLog } from '../models/error';

export default class GroupService extends CrudService<OpenGroupProps, GroupModel> {
  @wrapErrorsAndLog
  async getAll(): Promise<IGroup[]> {
    const groups = await this.model.findAll();
    return groups || [];
  }

  @wrapErrorsAndLog
  async addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<number> {
    const userGroups = await usersGroupModel.addUsersToGroup(id, userIDs);
    return userGroups.length;
  }
}
