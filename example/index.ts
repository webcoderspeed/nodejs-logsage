import express from 'express';
import { LoggerService, LoggerMiddleware, LoggerType } from '../src';

const app = express();

const logger = new LoggerService({type: LoggerType.PINO });

app.use(new LoggerMiddleware().use);

let count = 0;

app.get('/', (req, res) => {
  count++;
  logger.info('Inside app route', { count });

  setTimeout(() => {
  logger.info('Inside app route after 5s', { count });
  }, 5000)

  res.send('Hi');
});

app.listen(1337, () => logger.error(`Listening on port: 1337`));
