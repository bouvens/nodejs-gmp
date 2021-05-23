import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { withLogAndCatch } from '../../logger';
import { AppError, ErrorStatus } from '../../models/error';
import AuthService from '../../services/auth';
import { userModel } from '../../models/user';
import { login } from './validation';

const SECONDS_IN_HOUR = 60 * 60;

const authService = new AuthService(userModel);
const router = express.Router();

router.post(
  '/',
  login.validator,
  withLogAndCatch(async (req: login.ValidatedRequest, res, next) => {
    const { login, password } = req.body;
    const sub = await authService.auth(login, password);
    if (sub) {
      const token = jwt.sign({ sub }, config.jwtSecret, { expiresIn: SECONDS_IN_HOUR });
      res.send(token);
      next();
    } else {
      next(new AppError('Wrong login or password', ErrorStatus.forbidden));
    }
  }),
);

export default router;
