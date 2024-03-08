import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import * as logger from '../utils/logger';
import config from '../config/config';
import ApiError from '../utils/apiError';

// eslint-disable-next-line no-unused-vars
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message, code } = err;

  if (!(err instanceof ApiError)) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    code = httpStatus[`${httpStatus.INTERNAL_SERVER_ERROR}_NAME`];
  }

  res.locals.errorMessage = err.message;

  const response = {
    status: statusCode,
    code,
    reason: message,
    ...(config.env === 'development' && !(err instanceof ApiError) && { stack: err.stack }),
  };

  if (config.env === 'development' && !(err instanceof ApiError)) {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
