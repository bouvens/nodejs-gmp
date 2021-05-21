import { RequestHandler } from 'express';
import UserService from '../../services/user';
import { userModel } from '../../models/user';
import { OpenUserProps } from '../../types';
import { withLoggerAndAsyncHandler } from '../../logger';
import { user, userAutosuggestion } from './validation';
import { makeCrudRouter } from './crud';

const userService = new UserService(userModel);
const router = makeCrudRouter<OpenUserProps, UserService, user.ValidatedRequest>(
  userService,
  'userService',
  user.validator,
);

const validator: RequestHandler = userAutosuggestion.validator;

// Autosuggestion
router.get(
  '/',
  validator,
  withLoggerAndAsyncHandler(async (req: userAutosuggestion.ValidatedRequest, res, next) => {
    const { login, limit } = req.query;
    const users = await userService.getAutoSuggest(login, limit);
    res.json(users);
    next();
  }),
);

export default router;
