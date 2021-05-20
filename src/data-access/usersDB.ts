import { Sequelize } from 'sequelize';
import config from '../config';

export const sequelize = new Sequelize(config.dbUri);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully');
  })
  .catch((e) => {
    console.error('DB connection error:', e);
  });
