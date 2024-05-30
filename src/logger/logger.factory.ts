import { ILogger, ILoggerOptions, LoggerType } from '../types';
import { PinoService } from './pino.service';
import { WinstonService } from './winston.service';

export function getLogger({ type, options }: ILoggerOptions): ILogger {
  switch (type) {
    case LoggerType.PINO:
      return new PinoService(options);
    case LoggerType.WINSTON:
      return new WinstonService(options);
    default:
      throw new Error('Invalid logger type');
  }
}
