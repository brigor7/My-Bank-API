import express from 'express';
import winston from 'winston';
import { promises } from 'fs';
import accountsRouter from './routes/accounts.js';

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

global.fileName = 'accounts.json';

/**Passando as variaveis sem winston.label (por exemplo) */
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}:${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'my-bank-api.log',
    }),
  ],
  format: combine(label({ label: 'My-Bank-API' }), timestamp(), myFormat),
});

app.use(express.json());
app.use('/account', accountsRouter);

/**Levantando o servidor e criando o arquivo json caso não exista*/
app.listen(3000, async () => {
  try {
    await readFile(global.fileName, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    await writeFile(global.fileName, JSON.stringify(initialJson)).catch(
      (err) => {
        logger.console.error(err);
      }
    );
  }
});
