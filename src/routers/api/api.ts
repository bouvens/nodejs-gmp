import express from 'express';
import user from './user';

const router = express.Router();

router.use('/user', user);

// TODO router.all('/user/*', requireAuthentication);

export default router;
