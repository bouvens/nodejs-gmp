import express, { Express, NextFunction, Request, Response } from 'express';
import * as routers from './routers';

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

app.use('/api', routers.api);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 500 });
  next(err);
});
