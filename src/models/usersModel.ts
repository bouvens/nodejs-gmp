import { v4 as uuid } from 'uuid';
import { OpenUserProps, User } from '../types';
import * as db from '../data-access/usersDB';

export class UsersModel {
  static async add({ login, password, age }: OpenUserProps): Promise<User['id']> {
    const id = uuid();
    const user: User = { id, login, password, age, isDeleted: false };
    await db.add(user);
    return id;
  }

  static async findById(id: User['id']): Promise<User> {
    const selectedUser = await db.find(id);
    return selectedUser?.isDeleted ? null : selectedUser;
  }

  static async findByLogin(loginSubstring: string): Promise<User[]> {
    return db.findByLogin(loginSubstring).filter((user) => !user.isDeleted);
  }

  static async update(id: User['id'], updates: OpenUserProps): Promise<User> {
    return db.update({ id, ...updates });
  }

  static async delete(id: User['id']): Promise<User> {
    return db.update({ id, isDeleted: true });
  }
}

export type IUserModel = typeof UsersModel;
