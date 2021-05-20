import { Model } from 'sequelize';
import { IServiceProps } from '../types/common';

export const getPlainAndFiltered = <T extends IServiceProps>(item: Model<T> | null): T | null => {
  if (item === null) {
    return null;
  }
  const plainItem = item.get({ plain: true });
  delete plainItem.isDeleted;
  return plainItem;
};
