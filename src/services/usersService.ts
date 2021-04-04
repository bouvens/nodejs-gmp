import { v4 as uuid } from 'uuid';
import { OpenUserProps, User } from '../types';
import * as db from '../data-access/usersDB';

export function createUser({ login, password, age }: OpenUserProps): User['id'] {
  const id = uuid();
  const user: User = { id, login, password, age, isDeleted: false };
  db.add(user);
  return id;
}

export function getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
  const filteredUsers = db.findByLogin(loginSubstring).filter((user) => !user.isDeleted);

  if (filteredUsers.length > limit) {
    filteredUsers.length = limit;
  }

  filteredUsers.sort((user1, user2) => (user1.login < user2.login ? -1 : 1));

  return filteredUsers;
}

export function getUserById(id: User['id']): null | User {
  const selectedUser = db.find(id);

  if (selectedUser?.isDeleted) {
    return null;
  }

  return selectedUser;
}

export function updateUser(id: User['id'], updates: OpenUserProps): User {
  return db.update({ id, ...updates });
}

export function softDeleteUser(id: User['id']): void {
  db.update({ id, isDeleted: true });
}
