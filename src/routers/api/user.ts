import express from 'express';
import { AppError, ErrorStatus } from '../../services/error';
import UserService from '../../services/user';
import { UserModel } from '../../models/user';
import { userAutosuggestion, user } from './validation';

const router = express.Router();
const userService = new UserService(UserModel);

router.param('id', async (req, res, next, id) => {
  try {
    const user = await userService.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      next(new AppError(`No users with id: ${id}`, ErrorStatus.notFound));
    }
  } catch (e) {
    next(e);
  }
});

// Autosuggestion
router.get(
  '/',
  userAutosuggestion.validator,
  async (req: userAutosuggestion.ValidatedRequest, res, next) => {
    try {
      const { login, limit } = req.query;
      const users = await userService.getAutoSuggest(login, limit);
      res.json(users);
    } catch (e) {
      next(e);
    }
  },
);

// Create
router.post('/', user.validator, async (req: user.ValidatedRequest, res, next) => {
  try {
    const { login, password, age } = req.body;
    const id = await userService.create({ login, password, age });
    res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
  } catch (e) {
    next(e);
  }
});

// Read
router.get('/:id', (req, res) => {
  const { user } = req;
  res.json(user);
});

// Update
router.put('/:id', user.validator, async (req: user.ValidatedRequest, res, next) => {
  try {
    const { id } = req.user;
    const { login, password, age } = req.body;
    const user = await userService.update(id, { login, password, age });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { user } = req;
    if (await userService.delete(user.id)) {
      res.json({ message: `Deleted successfully: ${user.id}` });
    } else {
      next(new AppError("Can't delete", ErrorStatus.other));
    }
  } catch (e) {
    next(e);
  }
});

export default router;
