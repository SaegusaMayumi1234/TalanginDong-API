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

export const search = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.search(res.locals.user._id.toString(), req.query.search!.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const request = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.request(res.locals.user._id.toString(), req.body.recipientId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.cancel(res.locals.user._id.toString(), req.body.recipientId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const requestList = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.requestList(res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
