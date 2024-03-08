import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import './utils/uncaughtError';
import config from './config/config';
import * as logger from './utils/logger';
import db from './storages/mongoDB/index';
import NotFound from './middlewares/notFound';
import ErrorHandler from './middlewares/errorHandler';
import RoutesV1 from './routes/v1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Express = express();

(async () => {
  await db.mongoose.connect(config.mongodb.uri, {
    dbName: config.mongodb.name,
  });

  app.set('trust proxy', config.proxied);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(cors());

  app.use(express.static(path.join(__dirname, '/public')));

  app.use('/v1', RoutesV1);

  app.use(NotFound);
  app.use(ErrorHandler);

  app.listen(config.port, () => {
    logger.info(`TalanginDong-API server is running at http://localhost:${config.port}`);
  });
})();
