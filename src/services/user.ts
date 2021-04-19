import { OpenUserProps, User } from '../types';
import { IUserModel } from '../models/user';

export default class UserService {
  constructor(private UserModel: IUserModel) {}

  async create({ login, password, age }: OpenUserProps): Promise<User['id']> {
    return this.UserModel.add({ login, password, age });
  }

  async getAutoSuggest(loginSubstring: string, limit: number): Promise<User[]> {
    const users = await this.UserModel.findByLogin(loginSubstring, limit);
    return users || [];
  }

  async getById(id: User['id']): Promise<null | User> {
    return this.UserModel.findById(id);
  }

  async update(id: User['id'], updates: OpenUserProps): Promise<User> {
    return this.UserModel.update(id, updates);
  }

  async delete(id: User['id']): Promise<User> {
    return this.UserModel.softDelete(id);
  }
}
