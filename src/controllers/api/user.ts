import UserService from '../../services/user';
import { UserModel } from '../../models/user';
import { OpenUserProps } from '../../types';
import { withLogAndCatch } from '../../services/logger';
import { UserData } from '../../data-access/user';
import { user, userAutosuggestion } from './validation';
import { makeCrudRouter } from './crud';
import { makeAutosuggestion } from './user/autosuggestion';

const userModel = new UserModel(UserData, true);
const userService = new UserService(userModel);
const router = makeCrudRouter<OpenUserProps, UserService, user.ValidatedRequest>(
  userService,
  'userService',
  user.validator,
);

// Autosuggestion
const handleAutosuggestion = makeAutosuggestion(userService);
router.get('/', userAutosuggestion.validator, withLogAndCatch(handleAutosuggestion));

export default router;
