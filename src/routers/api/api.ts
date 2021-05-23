import express from 'express';
import login from './login';
import user from './user';
import group from './group';

const router = express.Router();

router.use('/login', login);
router.use('/user', user);
router.use('/group', group);

export default router;
