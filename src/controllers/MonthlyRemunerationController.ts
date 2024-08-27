import { Request, Response } from 'express';
import { getMonthlyRemunerationDetails, createMonthlyRemuneration } from '../models/monthlyRemuneration';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';
import { NotFoundError } from '../errors/customError';

/**
 * Fetch monthly remuneration details.
 * @param req - Express request object
 * @param res - Express response object
 */ 
export const fetchMonthlyRemunerationDetailsHandler = async (req: Request, res: Response) => {

  try {
    const monthlyRemuneration = await getMonthlyRemunerationDetails();
    if (!monthlyRemuneration) {
      throw new NotFoundError('Monthly remuneration details not found');
    }

    sendSuccessResponse(res, monthlyRemuneration, 'Monthly remuneration details fetched successfully');
  } catch (error: any) {
    console.error('Error fetching monthly remuneration details:', error);
    handleErrorResponse(error, res);
  }
}

/**
 * Insert monthly remuneration details.
 * @param req - Express request object
 * @param res - Express response object
 */
export const addMonthlyRemunerationHandler = async (req: Request, res: Response) => {
  const monthlyRemunerations = req.body;
  if (!Array.isArray(monthlyRemunerations)) {
    return res.status(400).json({ error: 'Request body must be an array of monthly remuneration details' });
  }

  try {
    await createMonthlyRemuneration(monthlyRemunerations);
    sendSuccessResponse(res, monthlyRemunerations, 'Monthly remuneration details added successfully');
  } catch (error: any) {
    console.error('Error adding monthly remuneration details:', error);
    handleErrorResponse(error, res);
  }
}