import { User } from './types';

const users: User[] = [
  {
    id: 'debf8bf4-41e2-4d77-90bb-90205ca9b5f1',
    login: 'user',
    password: 'p@ssw0rd',
    age: 20,
    isDeleted: false,
  },
  {
    id: '033c55e3-9224-47e0-9f1d-5f1cc6bc65d1',
    login: 'test1',
    password: 'qwerty',
    age: 25,
    isDeleted: false,
  },
  {
    id: '7ce269e7-2d0a-49e9-a806-bd1ec1a95525',
    login: 'admin',
    password: 'admin',
    age: 30,
    isDeleted: false,
  },
  {
    id: 'dab7613c-0e9a-4b94-8f74-29a11ddb7d29',
    login: 'default',
    password: 'f1d2d04f695a4fb598',
    age: 35,
    isDeleted: false,
  },
];

export const getUsers = (): User[] => users;

const findUser = (id: string): null | User => {
  const selectedUser = users.filter((user) => user.id === id);
  const { length } = selectedUser;
  if (length > 1) {
    throw Error(`ID duplications: ${id}`);
  }
  if (length === 0) {
    return null;
  }
  return selectedUser[0];
};

export const getUserById = (id: string): null | User => {
  const selectedUser = findUser(id);
  if (selectedUser?.isDeleted) {
    return null;
  }
  return selectedUser;
};

export const softDeleteUser = (selectedUser: User): void => {
  selectedUser.isDeleted = true;
};
