import { RequestHandler } from 'express';
import UserService from '../../../services/user';
import { userAutosuggestion } from '../validation';

export const makeAutosuggestion =
  (service: UserService): RequestHandler =>
  async (req: userAutosuggestion.ValidatedRequest, res, next): Promise<void> => {
    const { login, limit } = req.query;
    const users = await service.getAutoSuggest(login, limit);
    res.json(users);
    next();
  };
