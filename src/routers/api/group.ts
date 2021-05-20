import GroupService from '../../services/group';
import { groupModel } from '../../models/group';
import { addUsersToGroup, group } from './validation';
import { makeCrudRouter } from './crud';
import { OpenGroupProps } from '../../types';
import { AppError, ErrorStatus } from '../../services/error';

const groupService = new GroupService(groupModel);
const router = makeCrudRouter<OpenGroupProps, GroupService, group.ValidatedRequest>(
  groupService,
  group.validator,
);

// Read All
router.get('/', async (req, res, next) => {
  try {
    const groups = await groupService.getAll();
    res.json(groups);
  } catch (e) {
    next(e);
  }
});

// Add users to a group
router.put(
  '/:id/add-users',
  addUsersToGroup.validator,
  async (req: addUsersToGroup.ValidatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { users } = req.body;
      const status = await groupService.addUsersToGroup(id, users);
      if (status) {
        next(new AppError(status, ErrorStatus.internal));
        return;
      }
      res.json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
