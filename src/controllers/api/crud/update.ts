import { RequestHandler } from 'express';
import CrudService from '../../../services/crud';
import { uuid } from '../validation';

export const update =
  (service: CrudService<unknown>): RequestHandler =>
  async (req: uuid.ValidatedRequest, res, next): Promise<void> => {
    const { id } = req.params;
    const item = await service.update(id, req.body);
    res.json(item);
    next();
  };
