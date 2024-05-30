import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger';
import speedCache from '../db';
import { LOGGER_OPTIONS } from '../constants';
import { LoggerType } from '../types';

export class RequestMiddleware {
  private readonly options = speedCache.get(LOGGER_OPTIONS);

  private logger = new LoggerService(
    this.options ?? {
      type: LoggerType.PINO,
    },
  );

  constructor() {
    this.use = this.use.bind(this);
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info({
      method: req?.method,
      url: req?.url,
      headers: req?.headers,
      query: req?.query,
      body: req?.body,
    });

    next();
  }
}
