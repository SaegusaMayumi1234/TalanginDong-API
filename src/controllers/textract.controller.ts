import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import * as TextractService from '../services/textract.service';

export const scan = catchAsync(async (req: Request, res: Response) => {
  const data = await TextractService.scan(req.body.bytes);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    data,
  });
});
