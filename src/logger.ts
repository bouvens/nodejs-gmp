import winston, { format } from 'winston';
import { NextFunction, Request, Response } from 'express';

const { combine, timestamp, json, colorize, printf } = format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: 'gmp-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: combine(
        colorize(),
        printf(({ timestamp, level, message, service, ...rest }) => {
          const strRest = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : null;
          const strMessage = message ?? strRest;
          return `${timestamp} ${level}: ${strMessage}${strRest && message ? ` (${strRest})` : ''}`;
        }),
      ),
    }),
  );
}

export const loggerMiddleware = (
  { method, originalUrl, params, query }: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.http(method, { path: originalUrl, params, query });
  next();
};

export default logger;
