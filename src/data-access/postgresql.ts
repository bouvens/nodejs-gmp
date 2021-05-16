import { Sequelize } from 'sequelize';
import config from '../config';
import logger from '../logger';

export const sequelize = new Sequelize(config.dbUri);

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully');
  })
  .catch((e) => {
    logger.error(`DB connection error: ${e?.name}`);
    process.exit(5);
  });
