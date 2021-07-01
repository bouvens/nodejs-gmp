import { Op } from 'sequelize';
import { IUser, OpenUserProps } from '../types';
import { getPlainAndFiltered } from './common';
import CrudModel from './crud';
import { IBasicItem } from '../types/common';

export default class UserModel extends CrudModel<OpenUserProps> {
  async findByLogin(login: string): Promise<OpenUserProps & IBasicItem> {
    return this.sequelizeModel
      .findOne({ where: { login, isDeleted: false } })
      .then(getPlainAndFiltered);
  }

  async autoSuggest(loginSubstring: string, limit: number): Promise<IUser[]> {
    return this.sequelizeModel
      .findAll({
        where: { login: { [Op.like]: `%${loginSubstring}%` }, isDeleted: false },
        limit,
        order: ['login'],
      })
      .then((users) => users.map(getPlainAndFiltered));
  }
}
