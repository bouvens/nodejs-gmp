import { logTime } from '../logger';

export enum ErrorStatus {
  internal,
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

export function wrapErrorsAndLog<R>(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const methodName = `${target.constructor.name}.${propertyKey}`;
  const originalMethod = descriptor.value;
  return {
    ...descriptor,
    value: function (...args: unknown[]): R {
      const start = process.hrtime.bigint();
      return originalMethod
        .call(this, ...args)
        .catch(makeInternalError(methodName, args))
        .finally(logTime(start, methodName, args));
    },
  };
}
