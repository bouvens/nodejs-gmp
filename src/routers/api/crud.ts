import express, { RequestHandler, Router } from 'express';
import { AppError, ErrorStatus } from '../../services/error';
import CrudService from '../../services/crud';
import { loggerMiddleware } from '../../logger';
import { BodyValidatedRequest } from './validation/common';
import { uuid } from './validation';

export function makeCrudRouter<
  OpenItemProps,
  Service extends CrudService<OpenItemProps>,
  Request extends BodyValidatedRequest<unknown>
>(
  service: Service,
  validator: RequestHandler,
  idValidator: RequestHandler = uuid.validator,
): Router {
  const router = express.Router();

  // Create
  router.post('/', validator, loggerMiddleware, async (req: Request, res, next) => {
    try {
      const id = await service.create(req.body);
      res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
    } catch (e) {
      next(e);
    }
  });

  // Read
  router.get('/:id', idValidator, loggerMiddleware, async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await service.getById(id);
      if (item) {
        res.json(item);
        next();
      } else {
        next(new AppError(`No items with id: ${id}`, ErrorStatus.notFound));
      }
    } catch (e) {
      next(e);
    }
  });

  // Update
  router.put('/:id', idValidator, validator, loggerMiddleware, async (req: Request, res, next) => {
    try {
      const { id } = req.params;
      const item = await service.update(id, req.body);
      res.json(item);
    } catch (e) {
      next(e);
    }
  });

  // Delete
  router.delete('/:id', idValidator, loggerMiddleware, async (req, res, next) => {
    try {
      const { id } = req.params;
      if (await service.delete(id)) {
        res.json({ message: `Deleted successfully: ${id}` });
      } else {
        next(new AppError("Can't delete", ErrorStatus.other));
      }
    } catch (e) {
      next(e);
    }
  });

  return router;
}
