import express from 'express';
import { getUserById, softDeleteUser } from '../../usersDB';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  const user = getUserById(id);
  if (user) {
    req.user = user;
    next();
  } else {
    const message = `No users with id: ${id}`;
    res.status(404).json({ message });
    next(Error(message));
  }
});

router.get('/:id', (req, res) => {
  const { user } = req;
  res.json({ user });
});

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
