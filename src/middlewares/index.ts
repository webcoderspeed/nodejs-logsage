import { Application } from 'express';
import { LoggerMiddleware } from './logger.middleware';
import { RequestMiddleware } from './request.middleware';

export { LoggerMiddleware };

export const logsageMiddleware = (app: Application) => {
  app.use(new LoggerMiddleware().use);
  app.use(new RequestMiddleware().use);
};
