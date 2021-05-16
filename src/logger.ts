import winston, { format } from 'winston';

const { combine, timestamp, json } = format;

const jsonWithTimestamp = combine(timestamp(), json());

const logger = winston.createLogger({
  level: 'info',
  format: jsonWithTimestamp,
  defaultMeta: { service: 'gmp-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, service, ...rest }) => {
          const strRest = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : null;
          const strMessage = message ?? strRest;
          return `${timestamp} ${level}: ${strMessage}${strRest && message ? ` (${strRest})` : ''}`;
        }),
      ),
    }),
  );
}

export default logger;
