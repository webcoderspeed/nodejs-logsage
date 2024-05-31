import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger';
import speedCache from '../db';
import { LOGGER_OPTIONS } from '../constants';
import { LoggerType } from '../types';

export class RequestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const options = speedCache.get(LOGGER_OPTIONS);

    const logger = new LoggerService(
      options ?? {
        type: LoggerType.PINO,
      },
    );

    const startTime = performance.now();

    res.on('finish', () => {
      const endTime = performance.now();
      const responseTimeInMs = (endTime - startTime)?.toFixed(3);

      logger.info({
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        responseTime: `${responseTimeInMs} ms`,
        statusCode: res.statusCode,
      });
    });

    next();
  }
}
