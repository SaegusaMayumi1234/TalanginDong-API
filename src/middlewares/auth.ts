import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import db from '../storages/mongoDB/index';
import config from '../config/config';
import ApiError from '../utils/apiError';

export default () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers.authorization ?? '').replace(/Bearer /, '');
    const decodedPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
    const user = await db.userSchema.findById(decodedPayload.id);
    if (!user) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authorization token'));
      return;
    }
    jwt.verify(token, config.jwt.secret + user.password);
    res.locals.user = user;
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
