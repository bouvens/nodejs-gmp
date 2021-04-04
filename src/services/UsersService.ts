import { OpenUserProps, User } from '../types';
import { IUserModel } from '../models/usersModel';

export default class UsersService {
  constructor(private UserModel: IUserModel) {}

  async createUser({ login, password, age }: OpenUserProps): Promise<User['id']> {
    return this.UserModel.add({ login, password, age });
  }

  async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<User[]> {
    const filteredUsers = await this.UserModel.findByLogin(loginSubstring);

    if (filteredUsers.length > limit) {
      filteredUsers.length = limit;
    }

    filteredUsers.sort((user1, user2) => (user1.login < user2.login ? -1 : 1));

    return filteredUsers;
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
