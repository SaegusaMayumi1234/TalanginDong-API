import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import './utils/uncaughtError';
import * as logger from './utils/logger';
import configValidator from './utils/configValidator';
import db from './storages/mongoDB/index';
import NotFound from './middlewares/notFound';
import ErrorHandler from './middlewares/errorHandler';
import SignupRoute from './routes/v1/signup';
import LoginRoute from './routes/v1/login';

dotenv.config();
configValidator();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Express = express();
const port = process.env.PORT || 3000;

(async () => {
  await db.mongoose.connect(process.env.MONGODBURI!, {
    dbName: process.env.MONGODBNAME,
  });

  app.set('trust proxy', process.env.PROXIED === 'false' ? false : parseInt(process.env.PROXIED!, 10));
  // app.use(Auth);
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, '/public')));

  app.post('/v1/auth/signup', SignupRoute);
  app.post('/v1/auth/login', LoginRoute);

  app.use(NotFound);
  app.use(ErrorHandler);

  app.listen(port, () => {
    logger.info(`TalanginDong-API server is running at http://localhost:${port}`);
  });
})();
