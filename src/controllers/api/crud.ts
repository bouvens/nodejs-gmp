import express, { RequestHandler, Router } from 'express';
import CrudService from '../../services/crud';
import { withLogAndCatch } from '../../services/logger';
import { BodyValidatedRequest } from './validation/common';
import { uuid } from './validation';
import { create } from './crud/create';
import { read } from './crud/read';
import { update } from './crud/update';
import { deleteHandler } from './crud/delete';

export function makeCrudRouter<
  OpenItemProps,
  Service extends CrudService<OpenItemProps>,
  Request extends BodyValidatedRequest<unknown>,
>(
  service: Service,
  serviceName: string,
  validator: RequestHandler,
  idValidator: RequestHandler = uuid.validator,
): Router {
  const router = express.Router();

  // Create
  router.post('/', validator, withLogAndCatch(create(service)));

  // Read
  router.get('/:id', idValidator, withLogAndCatch(read(service)));

  // Update
  router.put('/:id', idValidator, validator, withLogAndCatch(update(service)));

  // Delete
  router.delete('/:id', idValidator, withLogAndCatch(deleteHandler(service)));

  return router;
}
