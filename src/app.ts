import express, { Express, NextFunction, Request, Response } from 'express';
import { getUserById, softDeleteUser } from './usersDB';

const PORT = process.env.PORT || 3000;

const app: Express = express();
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'gmp');
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = getUserById(userId);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: `No users with id: ${userId}` });
  }
});

app.delete('/user/:id', (req, res) => {
  const userId = req.params.id;
  const deletion = softDeleteUser(userId);
  if (deletion) {
    res.json({ message: `Deleted successfully: ${userId}` });
  } else {
    res.status(404).json({ message: `No users with id: ${userId}` });
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
