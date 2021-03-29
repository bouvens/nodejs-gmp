export class ExpressError extends Error {
  statusCode: number;
  expose: boolean;
  details?: string[];

  constructor(message: string, statusCode: number, details?: string[], expose?: boolean) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.expose = expose ?? statusCode < 500;
  }
}
