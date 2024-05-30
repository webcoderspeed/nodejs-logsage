import express from 'express';
import {
  LoggerService,
  LoggerType,
  EXECUTION_LOG_CALLER,
  EXECUTION_LOG_START_TIME,
  logsageMiddleware,
} from '../src';

const app = express();

logsageMiddleware(app);

const logger = new LoggerService({
  type: LoggerType.PINO,
  options: {
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            destination: 'api.log',
            singleLine: true,
            colorize: false,
            levelFirst: false,
            translateTime: 'dd-mm-yyyy hh:mm:ss TT',
          },
        },
        {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            levelFirst: false,
            translateTime: 'dd-mm-yyyy hh:mm:ss TT',
          },
        },
      ],
    },
  },
});

let count = 0;

app.get('/', (req, res) => {
  count++;

  const newTime = new Date().getTime();
  logger.info('Inside app route', { count });

  setTimeout(() => {
    logger.info('Inside app route after 5s', {
      count,
      [EXECUTION_LOG_START_TIME]: newTime,
      [EXECUTION_LOG_CALLER]: 'timer',
    });
  }, 5000);

  res.send('Hi');
});

app.listen(1337, () => logger.info(`Listening on port: 1337`));
