import { sequelize } from '../data-access/postgresql';
import logger from '../services/logger';

export default async (): Promise<void> =>
  new Promise((resolve) => {
    sequelize
      .authenticate()
      .then(() => {
        logger.info('Connection has been established successfully');
        resolve();
      })
      .catch((e) => {
        logger.error(`DB connection error: ${e?.name}`);
        process.exit(5);
      });
  });
