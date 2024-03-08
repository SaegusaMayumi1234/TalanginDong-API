import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import config from '../config/config';
import ApiError from '../utils/apiError';

export default () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    jwt.verify((req.headers.authorization ?? '').replace(/Bearer /, ''), config.jwt.secret);
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authorization token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token expired'));
    } else {
      next(error);
    }
  }
};
