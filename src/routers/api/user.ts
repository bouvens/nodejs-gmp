import express from 'express';
import {
  createUser,
  getAutoSuggestUsers,
  getUserById,
  softDeleteUser,
  updateUser,
} from '../../db/usersHandlers';
import { ExpressError } from '../../helpers/Error';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  const user = getUserById(id);
  if (user) {
    req.user = user;
    next();
  } else {
    next(new ExpressError(`No users with id: ${id}`, 404));
  }
});

// Autosuggestion
router.get(
  '/',
  (req, res, next) => {
    const { login, limit } = req.query;
    const errors = [];

    const parsedLogin = String(login);
    if (!parsedLogin || login === undefined) {
      errors.push(`login='${login}' should be a not empty string`);
    }

    const parsedLimit = Number(limit);
    if (!parsedLimit) {
      errors.push(`limit='${limit}' is not a positive integer number`);
    }

    if (errors.length) {
      next(new ExpressError('Incorrect query parameters', 400, errors));
    } else {
      req.autoSuggest = { login: parsedLogin, limit: parsedLimit };
      next();
    }
  },
  (req, res) => {
    const { login, limit } = req.autoSuggest;
    res.json(getAutoSuggestUsers(login, limit));
  },
);

// Create
router.post('/', (req, res) => {
  const { login: rawLogin, password: rawPassword, age: rawAge } = req.body;

  // TODO replace with validation
  const login = String(rawLogin);
  const password = String(rawPassword);
  const age = Number(rawAge);

  const id = createUser({ login, password, age });
  res.json({ id });
});

// Read
router.get('/:id', (req, res) => {
  const { user } = req;
  res.json({ user });
});

// Update
router.put('/:id', (req, res) => {
  const { id } = req.user;
  const { login: rawLogin, password: rawPassword, age: rawAge } = req.body;

  // TODO replace with validation
  const login = rawLogin && String(rawLogin);
  const password = rawPassword && String(rawPassword);
  const age = rawAge && Number(rawAge);

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
