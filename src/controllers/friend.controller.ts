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

export const pending = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.pending(res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const accept = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.accept(req.body.requesterId, res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const reject = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.reject(req.body.requesterId, res.locals.user._id.toString());
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const data = await FriendService.remove(res.locals.user._id.toString(), req.body.friendId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
