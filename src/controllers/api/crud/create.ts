import { Request, RequestHandler } from 'express';
import CrudService from '../../../services/crud';

export const create =
  (service: CrudService<unknown>): RequestHandler =>
  async (req: Request, res, next): Promise<void> => {
    const id = await service.create(req.body);
    res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
    next();
  };
