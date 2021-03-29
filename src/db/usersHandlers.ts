import { v4 as uuid } from 'uuid';
import { User } from '../types';
import * as db from './usersDB';

export function createUser({
  login,
  password,
  age,
}: Pick<User, 'login' | 'password' | 'age'>): User['id'] {
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

export function updateUser(id: User['id'], updates: Partial<User>): User {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );
  return db.update({ id, ...filteredUpdates });
}

export function softDeleteUser(id: User['id']): void {
  updateUser(id, { isDeleted: true });
}
