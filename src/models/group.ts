import CrudModel from './crud';
import { IGroup, OpenGroupProps } from '../types';
import { getPlainAndFiltered } from './common';

export default class GroupModel extends CrudModel<OpenGroupProps> {
  async findAll(): Promise<IGroup[] | void> {
    return this.sequelizeModel
      .findAll({
        order: ['name'],
      })
      .then((users) => users.map(getPlainAndFiltered));
  }
}
