import GroupService from '../../services/group';
import GroupModel from '../../models/group';
import UsersGroupModel from '../../models/users_groups';
import { GroupData } from '../../data-access/group';
import { UsersGroupsData } from '../../data-access/users_groups';
import { OpenGroupProps } from '../../types';
import { withLogAndCatch } from '../../services/logger';
import { usersGroups, group, uuid } from './validation';
import { makeCrudRouter } from './crud';
import { readAll } from './group/read-all';
import { addUsersToGroup } from './group/add-users-to-group';

const groupModel = new GroupModel(GroupData);
const usersGroupsModel = new UsersGroupModel(UsersGroupsData);
const groupService = new GroupService(groupModel, usersGroupsModel);

const router = makeCrudRouter<OpenGroupProps, GroupService, group.ValidatedRequest>(
  groupService,
  'groupService',
  group.validator,
);

// Read All
router.get('/', withLogAndCatch(readAll(groupService)));

// Add users to a group
router.post(
  '/:id/add-users',
  uuid.validator,
  usersGroups.validator,
  withLogAndCatch(addUsersToGroup(groupService)),
);

export default router;
