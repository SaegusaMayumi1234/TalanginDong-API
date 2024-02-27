import { Request, Response } from 'express';

export default (req: Request, res: Response) =>
  res.status(404).json({
    status: 404,
    reason: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
  });
