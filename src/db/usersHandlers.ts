import { User } from '../types';
import { getUsers } from './usersDB';

function findUser(id: string): null | User {
  const selectedUser = getUsers().filter((user) => user.id === id);
  const { length } = selectedUser;

  if (length > 1) {
    throw Error(`ID duplications: ${id}`);
  }

  if (length === 0) {
    return null;
  }

  return selectedUser[0];
}

export function getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
  const filteredUsers = getUsers().filter((user) => user.login.indexOf(loginSubstring) !== -1);

  if (filteredUsers.length > limit) {
    filteredUsers.length = limit;
  }

  filteredUsers.sort((user1, user2) => (user1.login < user2.login ? -1 : 1));

  return filteredUsers;
}

export function getUserById(id: string): null | User {
  const selectedUser = findUser(id);

  if (selectedUser?.isDeleted) {
    return null;
  }

  return selectedUser;
}

export function softDeleteUser(selectedUser: User): void {
  selectedUser.isDeleted = true;
}
