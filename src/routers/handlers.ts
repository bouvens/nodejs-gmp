import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { withLogger } from '../logger';

export const withHandlers = (serviceMethod: string) => (func: RequestHandler): RequestHandler =>
  withLogger(serviceMethod)(asyncHandler(func));
