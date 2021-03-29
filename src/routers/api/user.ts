import express from 'express';
import { getAutoSuggestUsers, getUserById, softDeleteUser } from '../../db/usersHandlers';
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

// Read
router.get('/:id', (req, res) => {
  const { user } = req;
  res.json({ user });
});

// Update

// Delete
router.delete('/:id', (req, res) => {
  const { user } = req;
  softDeleteUser(user);
  res.json({ message: `Deleted successfully: ${user.id}` });
});

export default router;
