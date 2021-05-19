export enum ErrorStatus {
  internal,
  notFound,
  other,
}

interface IDetails {
  args: Record<string, unknown>;
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

export class InternalError extends AppError {
  constructor(message: string, details: IDetails) {
    super(message, ErrorStatus.internal, details);
  }
}
