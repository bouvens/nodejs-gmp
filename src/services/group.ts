import { Group, OpenGroupProps } from '../types';
import { IGroupModel } from '../models/group';

export default class GroupService {
  constructor(private GroupModel: IGroupModel) {}

  async create({ name, permissions }: OpenGroupProps): Promise<Group['id']> {
    return this.GroupModel.add({ name, permissions });
  }

  async getAll(): Promise<Group[]> {
    const groups = await this.GroupModel.findAll();
    return groups || [];
  }

  async getById(id: Group['id']): Promise<null | Group> {
    return this.GroupModel.findById(id);
  }

  async update(id: Group['id'], updates: OpenGroupProps): Promise<Group> {
    return this.GroupModel.update(id, updates);
  }

  async delete(id: Group['id']): Promise<number> {
    return this.GroupModel.hardDelete(id);
  }
}
