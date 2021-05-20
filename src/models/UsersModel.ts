import { v4 as uuid } from 'uuid';
import { OpenUserProps, User } from '../types';
import { BOOLEAN, NUMBER, STRING, UUIDV4, Op, Model } from 'sequelize';
import { sequelize } from '../data-access/usersDB';

const User = sequelize.define(
  'user',
  {
    id: { type: UUIDV4, primaryKey: true },
    login: { type: STRING, allowNull: false },
    password: { type: STRING, allowNull: false },
    age: { type: NUMBER, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false },
  },
  {
    timestamps: false,
    tableName: 'users',
  },
);

const getPlain = <T>(item: Model<T>): T => item.get({ plain: true });

export class UsersModel {
  static async add({ login, password, age }: OpenUserProps): Promise<User['id']> {
    const id = uuid();
    await User.create({ id, login, password, age, isDeleted: false });
    return id;
  }

  static async findById(id: User['id']): Promise<User> {
    return User.findOne({ where: { id, isDeleted: false } })
      .then(getPlain)
      .catch(console.error);
  }

  static async findByLogin(loginSubstring: string, limit: number): Promise<User[] | void> {
    return User.findAll({
      where: { login: { [Op.like]: `%${loginSubstring}%` }, isDeleted: false },
      limit,
      order: ['login'],
    })
      .then((users) => users.map(getPlain))
      .catch(console.error);
  }

  static async update(id: User['id'], updates: Partial<User>): Promise<User> {
    return User.findOne({ where: { id, isDeleted: false } })
      .then((user) => user.update(updates))
      .then(getPlain)
      .catch(console.error);
  }

  static async delete(id: User['id']): Promise<User> {
    return this.update(id, { isDeleted: true });
  }
}

export type IUserModel = typeof UsersModel;
