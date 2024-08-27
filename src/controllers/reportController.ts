import { Request, Response } from 'express';

export const getReports = (req: Request, res: Response) => {
  res.send('GET request to the report route');
};

export const addReport = (req: Request, res: Response) => {
  res.send('POST request to the report route');
};