import winston, { format } from 'winston';
import { RequestHandler } from 'express';

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

const NS_IN_MS = 1_000_000n;

export const withLogAndCatch = (requestHandler: RequestHandler): RequestHandler =>
  function (req, res, next): Promise<void> {
    const { params, method, originalUrl, query } = req;
    const { author } = res.locals;
    res.locals.params = params;
    logger.http(method, { author, path: originalUrl, params, query });
    return Promise.resolve(requestHandler(req, res, next)).catch(next);
  };

export const logTime = (start: bigint, methodName: string, args: unknown[]) => (): void => {
  const end = process.hrtime.bigint();
  const executionTime = Number((end - start) / NS_IN_MS);
  logger.info(`Called ${methodName}`, { args, executionTime, executionTimeUnit: 'ms' });
};

export default logger;
