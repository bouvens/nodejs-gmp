import GroupService from '../../services/group';
import { groupModel } from '../../models/group';
import { OpenGroupProps } from '../../types';
import { withLoggerAndAsyncHandler } from '../../logger';
import { addUsersToGroup, group, uuid } from './validation';
import { makeCrudRouter } from './crud';

const groupService = new GroupService(groupModel);
const router = makeCrudRouter<OpenGroupProps, GroupService, group.ValidatedRequest>(
  groupService,
  'groupService',
  group.validator,
);

// Read All
router.get(
  '/',
  withLoggerAndAsyncHandler('groupService.getAll')(
    async (req: addUsersToGroup.ValidatedRequest, res, next) => {
      const groups = await groupService.getAll();
      res.json(groups);
      next();
    },
  ),
);

// Add users to a group
router.post(
  '/:id/add-users',
  uuid.validator,
  addUsersToGroup.validator,
  withLoggerAndAsyncHandler('groupService.addUsersToGroup')(
    async (req: addUsersToGroup.ValidatedRequest, res, next) => {
      const { id } = req.params;
      const { users } = req.body;
      await groupService.addUsersToGroup(id, users);
      res.json({ status: 'success' });
      next();
    },
  ),
);

export default router;