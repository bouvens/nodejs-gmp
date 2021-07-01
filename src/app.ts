import express, { Express } from 'express';
import config from './config';
import loaders from './loaders';
import logger from './services/logger';

process.on('uncaughtException', (err: string, origin: string) => {
  logger.error(err, { origin });
});

process.on('unhandledRejection', (err: Error) => {
  logger.error(err.stack, { origin: 'unhandledRejection' });
});

const app: Express = express();

loaders(app).then((app) => {
  app.listen(config.port, () => {
    logger.info(`Server is running at ${config.port}`);
  });
});
