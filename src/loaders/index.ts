import { Application } from 'express';
import expressLoader from './express';
import postgresqlLoader from './postgresql';

export default async (app: Application): Promise<Application> => {
  await postgresqlLoader();
  await expressLoader(app);
  return app;
};
