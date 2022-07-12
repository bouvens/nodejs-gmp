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

const makeInternalError =
  (methodName: string, args: IDetails['args']) =>
  (e: Error): InternalError => {
    throw new InternalError(e.message, { methodName, args });
  };

type Func = typeof Function.constructor;
type PatchedFunc<R> = (...args: unknown[]) => Promise<R | InternalError> | R;

function makeWrapperAndLogger<R>(withArgs = false) {
  return function decorator(
    target: unknown,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
    // TS requires type any for decorator return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    let fn: Func;
    let patchedFn: PatchedFunc<R>;

    if (descriptor) {
      fn = descriptor.value;
    }

    return {
      configurable: true,
      enumerable: false,
      get(): PatchedFunc<R> {
        if (!patchedFn) {
          patchedFn = (...args): ReturnType<PatchedFunc<R>> => {
            const methodName = `${target.constructor.name}.${propertyKey}`;
            const safeArgs = withArgs ? args : [{ safe: true }];
            const start = process.hrtime.bigint();
            const internalError = makeInternalError(methodName, safeArgs);
            const end = logTime(start, methodName, safeArgs);
            let result;
            try {
              result = fn.call(this, ...args);
            } catch (e) {
              internalError(e);
            }
            if (result?.catch) {
              return result.catch(internalError).finally(end);
            }
            end();
            return result;
          };
        }
        return patchedFn;
      },
      set(newFn: Func): void {
        patchedFn = undefined;
        fn = newFn;
      },
    };
  };
}

export const wrapErrorsAndLogSafely = makeWrapperAndLogger();

export const wrapErrorsAndLog = makeWrapperAndLogger(true);
