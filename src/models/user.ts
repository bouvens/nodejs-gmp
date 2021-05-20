import { BOOLEAN, NUMBER, STRING, UUIDV4, Op } from 'sequelize';
import { OpenUserProps, IUser } from '../types';
import { sequelize } from '../data-access/postgresql';
import { getPlainAndFiltered } from './common';
import { CrudModel } from './crud';

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

export class UserModel extends CrudModel<OpenUserProps> {
  async findByLogin(loginSubstring: string, limit: number): Promise<IUser[]> {
    return this.sequelizeModel
      .findAll({
        where: { login: { [Op.like]: `%${loginSubstring}%` }, isDeleted: false },
        limit,
        order: ['login'],
      })
      .then((users) => users.map(getPlainAndFiltered));
  }
}

export const userModel = new UserModel(User, true);
