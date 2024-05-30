import express from 'express';
import { LoggerService, LoggerMiddleware, LoggerType, EXECUTION_START_TIME } from '../src';

const app = express();

const logger = new LoggerService({type: LoggerType.PINO });

app.use(new LoggerMiddleware().use);

let count = 0;

app.get('/', (req, res) => {
  count++;

  const newTime = new Date().getTime()
  logger.info('Inside app route', { count, EXECUTION_START_TIME: newTime });

  setTimeout(() => {
  logger.info('Inside app route after 5s', { count,  EXECUTION_START_TIME: newTime  });
  }, 5000)

  res.send('Hi');
});

app.listen(1337, () => logger.error(`Listening on port: 1337`));
