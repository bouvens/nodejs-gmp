import { RequestHandler } from 'express';
import UserService from '../../services/user';
import { userModel } from '../../models/user';
import { OpenUserProps } from '../../types';
import { loggerMiddleware } from '../../logger';
import { user, userAutosuggestion } from './validation';
import { makeCrudRouter } from './crud';

const userService = new UserService(userModel);
const router = makeCrudRouter<OpenUserProps, UserService, user.ValidatedRequest>(
  userService,
  user.validator,
);

const validator: RequestHandler = userAutosuggestion.validator;

// Autosuggestion
router.get(
  '/',
  validator,
  loggerMiddleware,
  async (req: userAutosuggestion.ValidatedRequest, res, next) => {
    try {
      const { login, limit } = req.query;
      const users = await userService.getAutoSuggest(login, limit);
      res.json(users);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
