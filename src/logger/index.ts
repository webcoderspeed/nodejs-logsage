import { TraceIdHandler } from '../utils';
import { ILogger, ILoggerOptions, LoggerType } from '../types';
import { getLogger } from './logger.factory';
import { LoggerMiddleware } from '../middlewares';
import speedCache from '../db';
import { LOGGER_OPTIONS } from '../constants';

export class LoggerService {
  private logger: ILogger;

  constructor(
    options: ILoggerOptions = {
      type: LoggerType.PINO,
    },
  ) {
    this.logger = getLogger(options);
    speedCache.set(LOGGER_OPTIONS, options);
  }

  info(...optionalParams: any[]): void {
    this.logWithRequestId('info', ...optionalParams);
  }

  warn(...optionalParams: any[]): void {
    this.logWithRequestId('warn', ...optionalParams);
  }

  error(...optionalParams: any[]): void {
    this.logWithRequestId('error', ...optionalParams);
  }

  private addRequestId(...optionalParams: any[]) {
    const TRACE_ID = TraceIdHandler.getTraceIdField();
    const traceId = LoggerMiddleware.getTraceId();

    if (!traceId) return optionalParams;

    return optionalParams.concat({ [TRACE_ID]: traceId });
  }

  private logWithRequestId(
    level: keyof ILogger,
    ...optionalParams: any[]
  ): void {
    const formattedData = this.addRequestId(...optionalParams);
    this.logger[level](...formattedData);
  }
}
