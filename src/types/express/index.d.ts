declare namespace Express {
  interface Request {
    service?: import('../').ILogging;
  }
}
