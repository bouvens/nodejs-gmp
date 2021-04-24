import GroupService from '../../services/group';
import { groupModel } from '../../models/group';
import { group } from './validation';
import { makeCrudRouter } from './crud';
import { OpenGroupProps } from '../../types';

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

export default router;
