import { User } from '../types';

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
    login: 'test2',
    password: 'qwerty2',
    age: 24,
    isDeleted: false,
  },
  {
    id: 'e31bb796-d77c-4043-9502-7ed70864f546',
    login: 'test1',
    password: 'qwerty1',
    age: 25,
    isDeleted: false,
  },
  {
    id: '03953855-98c1-4c9d-b389-a2eb460ac9f6',
    login: 'test3test',
    password: 'qwerty3qwerty',
    age: 23,
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

const getAll = (): User[] => users;

export function add(user: User): void {
  users.push(user);
}

export function find(id: User['id']): null | User {
  return getAll().find((user) => user.id === id);
}

export const findByLogin = (loginSubstring: string): User[] =>
  getAll().filter((user) => user.login.indexOf(loginSubstring) !== -1);

const findIndex = (id: User['id']): number => getAll().findIndex((user) => user.id === id);

export function update(updates: Partial<User>): null | User {
  const index = findIndex(updates.id);
  if (index === -1) {
    return null;
  }

  const allUsers = getAll();
  const newUser = {
    ...allUsers[index],
    ...updates,
  };
  allUsers[index] = newUser;
  return newUser;
}
