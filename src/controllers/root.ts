import express from 'express';
import { default as api } from './api/api';

export const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

router.use('/api', api);
