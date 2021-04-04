import express from 'express';
import {
  createUser,
  getAutoSuggestUsers,
  getUserById,
  softDeleteUser,
  updateUser,
} from '../../db/usersHandlers';
import { AppError, ErrorStatus } from '../../helpers/Error';
import { autosuggestion, user } from './validation';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  const user = getUserById(id);
  if (user) {
    req.user = user;
    next();
  } else {
    next(new AppError(`No users with id: ${id}`, ErrorStatus.notFound));
  }
});

// Autosuggestion
router.get('/', autosuggestion.validator, (req: autosuggestion.ValidatedRequest, res) => {
  const { login, limit } = req.query;
  res.json(getAutoSuggestUsers(login, limit));
});

// Create
router.post('/', user.validator, (req: user.ValidatedRequest, res) => {
  const { login, password, age } = req.body;
  const id = createUser({ login, password, age });
  res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
});

// Read
router.get('/:id', (req, res) => {
  const { user } = req;
  res.json(user);
});

// Update
router.put('/:id', user.validator, (req: user.ValidatedRequest, res) => {
  const { id } = req.user;
  const { login, password, age } = req.body;
  const user = updateUser(id, { login, password, age });
  res.json(user);
});

// Delete
router.delete('/:id', (req, res) => {
  const { user } = req;
  softDeleteUser(user.id);
  res.json({ message: `Deleted successfully: ${user.id}` });
});

export default router;
