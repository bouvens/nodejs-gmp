declare namespace Express {
  interface Request {
    user?: import('../').User;
    group?: import('../').Group;
  }
}
