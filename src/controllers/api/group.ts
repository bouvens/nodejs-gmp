import GroupService from '../../services/group';
import { groupModel } from '../../models/group';
import { OpenGroupProps } from '../../types';
import { withLogAndCatch } from '../../services/logger';
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
  withLogAndCatch(async (req: addUsersToGroup.ValidatedRequest, res, next) => {
    const groups = await groupService.getAll();
    res.json(groups);
    next();
  }),
);

// Add users to a group
router.post(
  '/:id/add-users',
  uuid.validator,
  addUsersToGroup.validator,
  withLogAndCatch(async (req: addUsersToGroup.ValidatedRequest, res, next) => {
    const { id } = req.params;
    const { users } = req.body;
    await groupService.addUsersToGroup(id, users);
    res.json({ status: 'success' });
    next();
  }),
);

export default router;
