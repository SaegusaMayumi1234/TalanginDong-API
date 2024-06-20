import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import * as ProfileService from '../services/profile.service';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const data = await ProfileService.getProfile(res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
