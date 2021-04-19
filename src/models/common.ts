import { Model } from 'sequelize';

export const getPlain = <T>(item: Model<T>): T => item.get({ plain: true });
