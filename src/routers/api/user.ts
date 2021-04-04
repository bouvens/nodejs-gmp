import express from 'express';
import {
  createUser,
  getAutoSuggestUsers,
  getUserById,
  softDeleteUser,
  updateUser,
} from '../../services/usersService';
import { AppError, ErrorStatus } from '../../services/Error';
import { autosuggestion, user } from './validation';

const router = express.Router();

router.param('id', async (req, res, next, id) => {
  try {
    const user = await getUserById(id);
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
  autosuggestion.validator,
  async (req: autosuggestion.ValidatedRequest, res, next) => {
    try {
      const { login, limit } = req.query;
      const users = await getAutoSuggestUsers(login, limit);
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
    const id = await createUser({ login, password, age });
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
    const user = await updateUser(id, { login, password, age });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { user } = req;
    await softDeleteUser(user.id);
    res.json({ message: `Deleted successfully: ${user.id}` });
  } catch (e) {
    next(e);
  }
});

export default router;
