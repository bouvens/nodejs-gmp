import { GroupModel } from '../models/group';
import { usersGroupModel } from '../models/users_groups';
import { IGroup, OpenGroupProps } from '../types';
import { IBasicItem } from '../types/common';
import CrudService from './crud';
import { InternalError } from '../models/error';

export default class GroupService extends CrudService<OpenGroupProps, GroupModel> {
  getAll(): Promise<IGroup[]> {
    return this.model
      .findAll()
      .then((groups) => groups || [])
      .catch((e) => {
        throw new InternalError(e.message, {
          methodName: 'getAll',
          args: {},
        });
      });
  }

  addUsersToGroup(id: IBasicItem['id'], userIDs: IBasicItem['id'][]): Promise<number> {
    return usersGroupModel
      .addUsersToGroup(id, userIDs)
      .then((userGroups) => userGroups.length)
      .catch((e) => {
        throw new InternalError(e.message, {
          methodName: 'addUsersToGroup',
          args: { id, userIDs },
        });
      });
  }
}
