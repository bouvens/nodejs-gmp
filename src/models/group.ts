import { IGroup, OpenGroupProps } from '../types';
import { getPlainAndFiltered } from './common';
import { CrudModel } from './crud';

export default class GroupModel extends CrudModel<OpenGroupProps> {
  async findAll(): Promise<IGroup[] | void> {
    return this.sequelizeModel
      .findAll({
        order: ['name'],
      })
      .then((users) => users.map(getPlainAndFiltered));
  }
}
