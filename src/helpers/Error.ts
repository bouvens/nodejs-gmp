export enum ErrorStatus {
  internal,
  notFound,
}

export class AppError extends Error {
  status: ErrorStatus;
  expose: boolean;
  details?: string[];

  constructor(message: string, status: ErrorStatus, details?: string[], expose?: boolean) {
    super(message);
    this.status = status;
    this.details = details;
    this.expose = expose ?? status !== ErrorStatus.internal;
  }
}
