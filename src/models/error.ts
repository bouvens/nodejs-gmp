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
  status: ErrorStatus;
  expose: boolean;
  details?: IDetails;

  constructor(message: string, status: ErrorStatus, details?: IDetails) {
    super(message);
    this.status = status;
    this.details = details;
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

export function wrapErrors<R>(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const methodName = `${target.constructor.name}.${propertyKey}`;
  const originalMethod = descriptor.value;
  return {
    ...descriptor,
    value: function (...args: unknown[]): R {
      return originalMethod.call(this, ...args).catch(makeInternalError(methodName, args));
    },
  };
}
