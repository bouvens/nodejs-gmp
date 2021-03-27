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

app.param('id', (req, res, next, id) => {
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

app.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/user/:id', (req, res) => {
  const { user } = req;
  res.json({ user });
});

app.delete('/user/:id', (req, res) => {
  const { user } = req;
  softDeleteUser(user);
  res.json({ message: `Deleted successfully: ${user.id}` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
