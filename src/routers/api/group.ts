import asyncHandler from 'express-async-handler';
import GroupService from '../../services/group';
import { groupModel } from '../../models/group';
import { OpenGroupProps } from '../../types';
import { loggerMiddleware } from '../../logger';
import { addUsersToGroup, group, uuid } from './validation';
import { makeCrudRouter } from './crud';

const groupService = new GroupService(groupModel);
const router = makeCrudRouter<OpenGroupProps, GroupService, group.ValidatedRequest>(
  groupService,
  group.validator,
);

// Read All
router.get(
  '/',
  loggerMiddleware,
  asyncHandler(async (req, res) => {
    const groups = await groupService.getAll();
    res.json(groups);
  }),
);

// Add users to a group
router.post(
  '/:id/add-users',
  uuid.validator,
  addUsersToGroup.validator,
  loggerMiddleware,
  asyncHandler(async (req: addUsersToGroup.ValidatedRequest, res) => {
    const { id } = req.params;
    const { users } = req.body;
    await groupService.addUsersToGroup(id, users);
    res.json({ status: 'success' });
  }),
);

export default router;
