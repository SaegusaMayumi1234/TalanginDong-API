import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import * as AuthService from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  await AuthService.register(req.body.username, req.body.email, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.login(req.body.email, req.body.password);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.refreshToken(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
