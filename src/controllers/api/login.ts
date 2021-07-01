import express, { NextFunction, RequestHandler, Response } from 'express';
import logger, { withLogAndCatch } from '../../services/logger';
import { AppError, ErrorStatus } from '../../services/error';
import AuthService from '../../services/auth';
import UserModel from '../../models/user';
import { UserData } from '../../data-access/user';
import AuthModel from '../../models/auth';
import { AuthData } from '../../data-access/auth';
import config from '../../config';
import { ITokenPair } from '../../types';
import { login } from './validation';

const REFRESH_COOKIE = 'refresh_token';

const userModel = new UserModel(UserData, true);
const authModel = new AuthModel(AuthData);
const authService = new AuthService(userModel, authModel);
const router = express.Router();

function sendNewTokens(res: Response, next: NextFunction, tokens: ITokenPair): void {
  const { refresh, access } = tokens;
  res.cookie(REFRESH_COOKIE, refresh, {
    expires: new Date(Date.now() + config.refreshTokenExp),
    secure: false, // should be true with https
    httpOnly: true,
  });
  res.send(access);
  next();
}

router.post(
  '/',
  login.validator,
  withLogAndCatch(async (req: login.ValidatedRequest, res, next) => {
    const { login, password } = req.body;
    const tokens = await authService.login(login, password, req.ip);
    if (tokens) {
      sendNewTokens(res, next, tokens);
    } else {
      logger.warn('Wrong login or password', { login });
      next(new AppError('Failed to log in', ErrorStatus.forbidden));
    }
  }),
);

router.post(
  '/refresh',
  withLogAndCatch(async (req, res, next) => {
    const refreshToken = req.cookies[REFRESH_COOKIE];
    const ipAddress = req.ip;
    const newTokens = refreshToken && (await authService.refresh(refreshToken, ipAddress));

    if (!refreshToken || !newTokens) {
      logger.warn('Token refreshing failed', {
        ipAddress,
        refreshToken: !!refreshToken,
        newTokens: !!newTokens,
      });
      next(new AppError('Please log in', ErrorStatus.forbidden));
      return;
    }

    sendNewTokens(res, next, newTokens);
    next();
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
