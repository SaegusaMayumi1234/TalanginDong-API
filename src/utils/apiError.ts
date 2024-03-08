import httpStatus from 'http-status';

export default class ApiError extends Error {
  public statusCode: number;
  public code: any;

  public constructor(statusCode: number, message?: any, code?: string) {
    super(message ?? httpStatus[statusCode as keyof typeof httpStatus] ?? 'Unknown status code');
    this.statusCode = statusCode;
    this.code = code ?? httpStatus[`${statusCode}_NAME` as keyof typeof httpStatus] ?? 'UNKNOWN_STATUS_CODE';
    Error.captureStackTrace(this, this.constructor);
  }
}
