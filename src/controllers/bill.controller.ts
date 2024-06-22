import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import * as BillService from '../services/bill.service';

export const createBill = catchAsync(async (req: Request, res: Response) => {
  await BillService.createBill(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

export const getBill = catchAsync(async (req: Request, res: Response) => {
  const data = await BillService.getBill();
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
