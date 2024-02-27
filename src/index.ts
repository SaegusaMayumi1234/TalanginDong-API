import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import * as logger from './utils/logger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Success');
});

app.listen(port, () => {
  console.log(`TalanginDong-API server is running at http://localhost:${port}`);
});

logger.info('test');
