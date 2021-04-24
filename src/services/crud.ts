import { CrudModel } from '../models/crud';
import { IBasicItem } from '../types/common';

export default class CrudService<
  OpenItemProps,
  Model extends CrudModel<OpenItemProps> = CrudModel<OpenItemProps>
> {
  constructor(protected model: Model) {}

  async create(props: OpenItemProps): Promise<IBasicItem['id']> {
    return this.model.add(props);
  }

  async getById(id: IBasicItem['id']): Promise<void | (OpenItemProps & IBasicItem)> {
    return this.model.find(id);
  }

  async update(
    id: IBasicItem['id'],
    updates: OpenItemProps,
  ): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.model.update(id, updates);
  }

  async delete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void | number> {
    return this.model.delete(id);
  }
}
