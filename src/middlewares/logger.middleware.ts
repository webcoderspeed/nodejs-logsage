import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createNamespace, getNamespace } from 'cls-hooked';
import { APP_NAME } from '../constants';
import { TraceIdHandler } from '../utils';

export class LoggerMiddleware {
  private static clsNamespace =
    getNamespace(APP_NAME) ?? createNamespace(APP_NAME);

  use(req: Request, res: Response, next: NextFunction) {
    const TRACE_ID = TraceIdHandler.getTraceIdField();

    const traceId =
      (req?.headers?.[TRACE_ID] as string) ??
      (req?.body?.[TRACE_ID] as string) ??
      (req?.query?.[TRACE_ID] as string) ??
      uuidv4();

    LoggerMiddleware.clsNamespace.run(() => {
      req.headers[TRACE_ID] = traceId;
      const requestId = req.headers[TRACE_ID];
      LoggerMiddleware.clsNamespace.set(TRACE_ID, requestId);
      next();
    });
  }

  static getTraceId(): string {
    const TRACE_ID = TraceIdHandler.getTraceIdField();
    const cls = getNamespace(APP_NAME);
    return cls ? cls.get(TRACE_ID) : '';
  }
}
