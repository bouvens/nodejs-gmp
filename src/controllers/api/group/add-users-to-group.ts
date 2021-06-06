import { RequestHandler } from 'express';
import GroupService from '../../../services/group';
import { usersGroups } from '../validation';

export const addUsersToGroup =
  (service: GroupService): RequestHandler =>
  async (req: usersGroups.ValidatedRequest, res, next): Promise<void> => {
    const { id } = req.params;
    const { users } = req.body;
    await service.addUsersToGroup(id, users);
    res.json({ status: 'success' });
    next();
  };
