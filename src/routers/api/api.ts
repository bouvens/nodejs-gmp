import express from 'express';
import login, { withTokenCheck } from './login';
import user from './user';
import group from './group';

const router = express.Router();

router.use('/login', login);
router.use('/user', withTokenCheck, user);
router.use('/group', withTokenCheck, group);

export default router;
