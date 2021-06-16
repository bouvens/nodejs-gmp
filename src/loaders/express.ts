import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routers from '../controllers';
import { AppError, ErrorStatus } from '../services/error';
import logger from '../services/logger';

const httpCodeByErrorStatus: Record<ErrorStatus, number> = {
  [ErrorStatus.other]: 400,
  [ErrorStatus.unauthorized]: 401,
  [ErrorStatus.forbidden]: 403,
  [ErrorStatus.notFound]: 404,
  [ErrorStatus.internal]: 500,
};

export default async (app: Application): Promise<void> => {
  app.disable('x-powered-by');

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.use('/', routers);

  app.use((err: Error | AppError, req: Request, res: Response, _next: NextFunction) => {
    const { method, originalUrl, query } = req;
    const { params } = res.locals;

    if ('expose' in err && err.expose) {
      res
        .status(httpCodeByErrorStatus[err.status])
        .json({ error: err.message, details: err.details });
    } else {
      const details = 'details' in err ? err.details : undefined;
      logger.error(err.stack, {
        req: { method, originalUrl, params, query },
        details,
      });
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error' });
    }
  });
};
