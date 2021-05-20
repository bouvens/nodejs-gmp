import { OpenUserProps, User } from '../types';
import { IUserModel } from '../models/UsersModel';

export default class UsersService {
  constructor(private UserModel: IUserModel) {}

  async createUser({ login, password, age }: OpenUserProps): Promise<User['id']> {
    return this.UserModel.add({ login, password, age });
  }

  async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
    const users = await this.UserModel.findByLogin(loginSubstring, limit);
    return users || [];
  }

  async getUserById(id: User['id']): Promise<null | User> {
    return this.UserModel.findById(id);
  }

  async updateUser(id: User['id'], updates: OpenUserProps): Promise<User> {
    return this.UserModel.update(id, updates);
  }

  async softDeleteUser(id: User['id']): Promise<void> {
    await this.UserModel.delete(id);
  }
}
