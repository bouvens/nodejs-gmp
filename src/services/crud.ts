import { CrudModel } from '../models/crud';
import { IBasicItem } from '../types/common';
import { InternalError } from '../models/error';

export default class CrudService<
  OpenItemProps,
  Model extends CrudModel<OpenItemProps> = CrudModel<OpenItemProps>
> {
  constructor(protected model: Model) {}

  async create(props: OpenItemProps): Promise<IBasicItem['id']> {
    return this.model.add(props).catch((e) => {
      throw new InternalError(e.message, {
        methodName: 'create',
        args: { props },
      });
    });
  }

  async getById(id: IBasicItem['id']): Promise<OpenItemProps & IBasicItem> {
    return this.model.find(id).catch((e) => {
      throw new InternalError(e.message, {
        methodName: 'getById',
        args: { id },
      });
    });
  }

  async update(
    id: IBasicItem['id'],
    updates: OpenItemProps,
  ): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.model.update(id, updates).catch((e) => {
      throw new InternalError(e.message, {
        methodName: 'update',
        args: { id, updates },
      });
    });
  }

  async delete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void | number> {
    return this.model.delete(id).catch((e) => {
      throw new InternalError(e.message, {
        methodName: 'delete',
        args: { id },
      });
    });
  }
}
