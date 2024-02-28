import { Request, Response } from 'express';

import * as logger from '../utils/logger';

export default (error: any, req: Request, res: Response) => {
  res.status(500).json({
    status: 500,
    code: 'UNKNOWN_ERROR',
    reason: '',
  });
  logger.error(error);
};
