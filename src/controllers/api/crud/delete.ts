import { RequestHandler } from 'express';
import CrudService from '../../../services/crud';
import { uuid } from '../validation';
import { AppError, ErrorStatus } from '../../../services/error';

export const deleteHandler =
  (service: CrudService<unknown>): RequestHandler =>
  async (req: uuid.ValidatedRequest, res, next): Promise<void> => {
    const { id } = req.params;
    if (await service.delete(id)) {
      res.json({ message: `Deleted successfully: ${id}` });
      next();
    } else {
      next(new AppError("Can't delete", ErrorStatus.other));
    }
  };
