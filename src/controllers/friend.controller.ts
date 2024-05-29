import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import * as FriendService from '../services/friend.service';

export const list = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.list(res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
