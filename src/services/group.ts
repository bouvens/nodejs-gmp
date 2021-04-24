import { IGroup, OpenGroupProps } from '../types';
import { GroupModel } from '../models/group';
import CrudService from './crud';

export default class GroupService extends CrudService<OpenGroupProps, GroupModel> {
  async getAll(): Promise<IGroup[]> {
    const groups = await this.model.findAll();
    return groups || [];
  }
}
