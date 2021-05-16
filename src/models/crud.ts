import { Model, ModelCtor } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { IBasicItem, IServiceProps } from '../types/common';
import { getPlainAndFiltered } from './common';
import logger from '../logger';

export class CrudModel<OpenItemProps> {
  constructor(
    protected sequelizeModel: ModelCtor<Model<OpenItemProps & IBasicItem & IServiceProps>>,
    private withSoftDelete = false,
  ) {}

  async add(props: OpenItemProps): Promise<IBasicItem['id']> {
    const id = uuid();
    await this.sequelizeModel.create({
      ...props,
      id,
      ...(this.withSoftDelete ? { isDeleted: false } : {}),
    });
    return id;
  }

  async find(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.sequelizeModel
      .findOne({ where: { id, ...(this.withSoftDelete ? { isDeleted: false } : {}) } })
      .then(getPlainAndFiltered)
      .catch((e) => {
        logger.error(e);
      });
  }

  async update(
    id: IBasicItem['id'],
    updates: Partial<OpenItemProps & IBasicItem> | IServiceProps,
  ): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.sequelizeModel
      .findOne({ where: { id, ...(this.withSoftDelete ? { isDeleted: false } : {}) } })
      .then((item) => item.update(updates))
      .then(getPlainAndFiltered)
      .catch((e) => {
        logger.error(e);
      });
  }

  async softDelete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void> {
    return this.update(id, { isDeleted: true });
  }

  async hardDelete(id: IBasicItem['id']): Promise<number> {
    return this.sequelizeModel.destroy({ where: { id } });
  }

  async delete(id: IBasicItem['id']): Promise<(OpenItemProps & IBasicItem) | void | number> {
    return this.withSoftDelete ? this.softDelete(id) : this.hardDelete(id);
  }
}
