import { Response } from 'express';
import { CustomError, ConflictError } from '../errors/customError';
import { Prisma } from '@prisma/client';

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success'
) => {
  return res.status(200).json({
    status: 'success',
    message,
    data,
  });
};

export const handleErrorResponse = (error: any, res: Response): void => {
  if (error instanceof CustomError) {
      res.status(error.statusCode).json({ status: 'error', message: error.message });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const conflictError = new ConflictError(
          'An employee with the same first name, last name, date of birth, phone number, and address already exists. Please verify the details and try again.'
      );
      res.status(conflictError.statusCode).json({ status: 'error', message: conflictError.message, error: error.message });
  } else {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
  }
};