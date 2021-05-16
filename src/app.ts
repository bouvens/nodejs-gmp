import express, { Express, NextFunction, Request, Response } from 'express';
import config from './config';
import logger from './logger';
import routers from './routers';
import { AppError, ErrorStatus } from './services/error';

const httpCodeByErrorStatus: Record<ErrorStatus, number> = {
  [ErrorStatus.internal]: 500,
  [ErrorStatus.notFound]: 404,
  [ErrorStatus.other]: 400,
};

const app: Express = express();
app.listen(config.port, () => {
  logger.info(`Server is running at ${config.port}`);
});

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'gmp');
  next();
});

app.use('/', routers);

app.use((err: Error | AppError, req: Request, res: Response, _next: NextFunction) => {
  if ('expose' in err && err.expose) {
    res
      .status(httpCodeByErrorStatus[err.status])
      .json({ error: err.message, details: err.details });
  } else {
    logger.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});
