import { Request, Response, NextFunction } from 'express';
import { handleErrorResponse } from '../utils/responseHandler';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  handleErrorResponse(err, res);
};