import express, { Express } from 'express';

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

// it's easier to use just req.params.id
app.param('id', (req, res, next, id) => {
  req.id = id;
  next();
});

app.get('/', (req, res) => {
  const { headers, body, query } = req;
  res.json({ headers, body, query });
});

app.get('/user/:id', (req, res) => {
  const userId: number = parseInt(req.id, 10);
  res.json({ userId });
});
