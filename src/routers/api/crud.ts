import express, { RequestHandler, Router } from 'express';
import { AppError, ErrorStatus } from '../../models/error';
import CrudService from '../../services/crud';
import { withLogAndCatch } from '../../logger';
import { BodyValidatedRequest } from './validation/common';
import { uuid } from './validation';

export function makeCrudRouter<
  OpenItemProps,
  Service extends CrudService<OpenItemProps>,
  Request extends BodyValidatedRequest<unknown>
>(
  service: Service,
  serviceName: string,
  validator: RequestHandler,
  idValidator: RequestHandler = uuid.validator,
): Router {
  const router = express.Router();

  // Create
  router.post(
    '/',
    validator,
    withLogAndCatch(async (req: Request, res, next) => {
      const id = await service.create(req.body);
      res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
      next();
    }),
  );

  // Read
  router.get(
    '/:id',
    idValidator,
    withLogAndCatch(async (req: Request, res, next) => {
      const { id } = req.params;
      const item = await service.getById(id);
      if (item) {
        res.json(item);
        next();
      } else {
        next(new AppError(`No items with id: ${id}`, ErrorStatus.notFound));
      }
    }),
  );

  // Update
  router.put(
    '/:id',
    idValidator,
    validator,
    withLogAndCatch(async (req: Request, res, next) => {
      const { id } = req.params;
      const item = await service.update(id, req.body);
      res.json(item);
      next();
    }),
  );

  // Delete
  router.delete(
    '/:id',
    idValidator,
    withLogAndCatch(async (req: Request, res, next) => {
      const { id } = req.params;
      if (await service.delete(id)) {
        res.json({ message: `Deleted successfully: ${id}` });
        next();
      } else {
        next(new AppError("Can't delete", ErrorStatus.other));
      }
    }),
  );

  return router;
}
