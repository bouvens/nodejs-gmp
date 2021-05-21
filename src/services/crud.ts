import { CrudModel } from '../models/crud';
import { IBasicItem } from '../types/common';
import { wrapErrors } from '../models/error';

export default class CrudService<
  OpenItemProps,
  Model extends CrudModel<OpenItemProps> = CrudModel<OpenItemProps>
> {
  constructor(protected model: Model) {}

  @wrapErrors
  async create(props: OpenItemProps): Promise<IBasicItem['id']> {
    return this.model.add(props);
  }

  @wrapErrors
  async getById(id: IBasicItem['id']): Promise<OpenItemProps & IBasicItem> {
    return this.model.find(id);
  }

  @wrapErrors
  async update(
    id: IBasicItem['id'],
    updates: OpenItemProps,
  ): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.model.update(id, updates);
  }

  @wrapErrors
  async delete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void | number> {
    return this.model.delete(id);
  }
}
