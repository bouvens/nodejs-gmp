import express, { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { withLogAndCatch } from '../../logger';
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
    const sub = await authService.auth(login, password);
    if (sub) {
      const token = jwt.sign({ sub }, config.jwtSecret, { expiresIn: '1h' });
      res.send(token);
      next();
    } else {
      next(new AppError('Wrong login or password', ErrorStatus.forbidden));
    }
  }),
);

export const withTokenCheck: RequestHandler = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    next(new AppError('No token provided', ErrorStatus.unauthorized));
    return;
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, _decoded) => {
    if (err) {
      next(new AppError('Failed to authenticate token', ErrorStatus.forbidden));
      return;
    }
    next();
  });
};

export default router;
