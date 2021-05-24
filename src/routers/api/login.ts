import express, { RequestHandler } from 'express';
import logger, { withLogAndCatch } from '../../logger';
import { AppError, ErrorStatus } from '../../models/error';
import AuthService from '../../services/auth';
import { userModel } from '../../models/user';
import { login } from './validation';

const authService = new AuthService(userModel);
const router = express.Router();

router.post(
  '/',
  login.validator,
  withLogAndCatch(async (req: login.ValidatedRequest, res, next) => {
    const { login, password } = req.body;
    const token = await authService.login(login, password);
    if (token) {
      res.send(token);
      next();
    } else {
      logger.warn('Wrong login or password', { login });
      next(new AppError('Failed to log in', ErrorStatus.forbidden));
    }
  }),
);

export const withTokenCheck: RequestHandler = async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  const { method, originalUrl, query } = req;
  if (!bearerHeader) {
    logger.warn('No token', { method, originalUrl, query });
    next(new AppError('No token provided', ErrorStatus.unauthorized));
    return;
  }
  const token = bearerHeader.split(' ')[1];
  try {
    const decoded = await authService.authenticate(token);
    res.locals.author = decoded.sub;
    next();
  } catch (error) {
    logger.warn('Wrong authenticate token', { method, originalUrl, query, error });
    next(new AppError('Failed to authenticate token', ErrorStatus.forbidden));
  }
};

export default router;
