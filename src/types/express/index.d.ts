declare namespace Express {
  interface Request {
    user?: import('../').User;
    autoSuggest?: {
      login: string;
      limit: number;
    };
  }
}
