import { RequestHandler } from 'express';
import GroupService from '../../../services/group';

export const readAll =
  (service: GroupService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const groups = await service.getAll();
    res.json(groups);
    next();
  };
