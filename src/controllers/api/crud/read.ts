import { RequestHandler } from 'express';
import CrudService from '../../../services/crud';
import { uuid } from '../validation';
import { AppError, ErrorStatus } from '../../../services/error';

export const read =
  (service: CrudService<unknown>): RequestHandler =>
  async (req: uuid.ValidatedRequest, res, next): Promise<void> => {
    const { id } = req.params;
    const item = await service.getById(id);
    if (item) {
      res.json(item);
      next();
    } else {
      next(new AppError(`No items with id: ${id}`, ErrorStatus.notFound));
    }
  };
