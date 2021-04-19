import express from 'express';
import { AppError, ErrorStatus } from '../../services/error';
import GroupService from '../../services/group';
import { GroupModel } from '../../models/group';
import { group } from './validation';

const router = express.Router();
const groupService = new GroupService(GroupModel);

router.param('id', async (req, res, next, id) => {
  try {
    const group = await groupService.getById(id);
    if (group) {
      req.group = group;
      next();
    } else {
      next(new AppError(`No groups with id: ${id}`, ErrorStatus.notFound));
    }
  } catch (e) {
    next(e);
  }
});

// Create
router.post('/', group.validator, async (req: group.ValidatedRequest, res, next) => {
  try {
    const { name, permissions } = req.body;
    const id = await groupService.create({ name, permissions });
    res.status(201).set('Location', `${req.originalUrl}/${id}`).json({ id });
  } catch (e) {
    next(e);
  }
});

// Read
router.get('/:id', (req, res) => {
  const { group } = req;
  res.json(group);
});

// Read All
router.get('/', async (req, res, next) => {
  try {
    const groups = await groupService.getAll();
    res.json(groups);
  } catch (e) {
    next(e);
  }
});

// Update
router.put('/:id', group.validator, async (req: group.ValidatedRequest, res, next) => {
  try {
    const { id } = req.group;
    const { name, permissions } = req.body;
    const group = await groupService.update(id, { name, permissions });
    res.json(group);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { group } = req;
    if (await groupService.delete(group.id)) {
      res.json({ message: `Deleted successfully: ${group.id}` });
    } else {
      next(new AppError("Can't delete", ErrorStatus.other));
    }
  } catch (e) {
    next(e);
  }
});

export default router;
