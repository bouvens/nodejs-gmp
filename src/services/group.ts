import { IGroup, OpenGroupProps } from '../types';
import { GroupModel } from '../models/group';
import CrudService from './crud';
import { IBasicItem } from '../types/common';
import { usersGroupModel } from '../models/users_groups';

export default class GroupService extends CrudService<OpenGroupProps, GroupModel> {
  async getAll(): Promise<IGroup[]> {
    const groups = await this.model.findAll();
    return groups || [];
  }

  async addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<void | string> {
    return await usersGroupModel.addUsersToGroup(id, userIDs);
  }
}
