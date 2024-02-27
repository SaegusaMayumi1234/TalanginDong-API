import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import * as logger from './utils/logger';
import NotFound from './middlewares/notFound';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const proxied = process.env.PROXIED;

app.set('trust proxy', !proxied || proxied === 'false' || isNaN(parseInt(proxied)) ? false : parseInt(proxied));
// app.use(Auth);
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Success');
});

app.use(NotFound);

app.listen(port, () => {
  logger.info(`TalanginDong-API server is running at http://localhost:${port}`);
});
