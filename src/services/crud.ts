import CrudModel from '../models/crud';
import { IBasicItem } from '../types/common';
import { wrapErrorsAndLog, wrapErrorsAndLogSafely } from './error';

export default class CrudService<
  OpenItemProps,
  Model extends CrudModel<OpenItemProps> = CrudModel<OpenItemProps>,
> {
  constructor(protected model: Model) {}

  @wrapErrorsAndLog
  async create(props: OpenItemProps): Promise<IBasicItem['id']> {
    return this.model.add(props);
  }

  @wrapErrorsAndLog
  async getById(id: IBasicItem['id']): Promise<OpenItemProps & IBasicItem> {
    return this.model.find(id);
  }

  @wrapErrorsAndLogSafely
  async update(
    id: IBasicItem['id'],
    updates: OpenItemProps,
  ): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.model.update(id, updates);
  }

  @wrapErrorsAndLog
  async delete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void | number> {
    return this.model.delete(id);
  }
}
