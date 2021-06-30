import { logTime } from './logger';

export enum ErrorStatus {
  internal,
  forbidden,
  unauthorized,
  notFound,
  other,
}

interface IDetails {
  methodName: string;
  args: unknown[];
}

export class AppError extends Error {
  expose: boolean;

  constructor(message: string, public status: ErrorStatus, public details?: IDetails) {
    super(message);
    this.expose = status !== ErrorStatus.internal;
  }
}

class InternalError extends AppError {
  constructor(message: string, details: IDetails) {
    super(message, ErrorStatus.internal, details);
  }
}

const makeInternalError = (methodName: string, args: IDetails['args']) => (
  e: Error,
): InternalError => {
  throw new InternalError(e.message, { methodName, args });
};

function makeWrapperAndLogger<R>(withArgs = false) {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const methodName = `${target.constructor.name}.${propertyKey}`;
    const originalMethod = descriptor.value;
    return {
      ...descriptor,
      value: function (...args: unknown[]): R {
        const safeArgs = withArgs ? args : [{ safe: true }];
        const start = process.hrtime.bigint();
        const internalError = makeInternalError(methodName, safeArgs);
        const end = logTime(start, methodName, safeArgs);
        let result;
        try {
          result = originalMethod.call(this, ...args);
        } catch (e) {
          internalError(e);
        }
        if (result.catch) {
          return result.catch(internalError).finally(end);
        }
        end();
        return result;
      },
    };
  };
}

export const wrapErrorsAndLogSafely = makeWrapperAndLogger();

export const wrapErrorsAndLog = makeWrapperAndLogger(true);
