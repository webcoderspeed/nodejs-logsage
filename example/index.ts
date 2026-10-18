import express from 'express';
import {
  LoggerService,
  LoggerType,
  EXECUTION_LOG_CALLER,
  EXECUTION_LOG_START_TIME,
  logsageMiddleware,
  logExecutionTime,
  transports,
  format,
} from '../src';

const { colorize, printf, combine, timestamp } = format;

const app = express();

logsageMiddleware(app);

const logger = new LoggerService({
  type: LoggerType.WINSTON,
  options: {
    level: 'debug',
    transports: [
      new transports.Console({
        format: combine(
          timestamp({
            format: 'YYYY-MM-DDThh:mm:ss',
          }),
          colorize({ all: true }),
          printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`),
        ),
      }),
      new transports.File({
        filename: 'api.log',
      }),
    ],
    format: combine(
      timestamp({
        format: 'YYYY-MM-DDThh:mm:ss',
      }),
      printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`),
    ),
  },
});

let count = 0;

app.get('/', (req, res) => {
  count++;

  const newTime = new Date().getTime();
  logger.error('Inside app route');

  setTimeout(() => {
    logger.info('Inside app route after 5s', {
      count,
      [EXECUTION_LOG_START_TIME]: newTime,
      [EXECUTION_LOG_CALLER]: 'timer',
    });
  }, 5000);

  res.send('Hi');
});

app.listen(1337, () => logger.debug(`Listening on port: 1337`));

// Example 1: Decorator applied to class
@logExecutionTime
class A {
  sayHello() {
    logger.info('Hello');
  }

  helloWorld() {
    logger.info('World');
  }
}

// Example 2: Decorator applied to method
class B {
  @logExecutionTime
  sayHello() {
    logger.info('Hello');
  }

  helloWorld() {
    logger.info('World');
  }
}

// Testing the decorators
const a = new A();
a.sayHello();
a.helloWorld();

const b = new B();
b.sayHello();
b.helloWorld();
