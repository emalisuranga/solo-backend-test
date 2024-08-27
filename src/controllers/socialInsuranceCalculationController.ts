import { Request, Response } from 'express';
import { getSocialInsuranceCalculationDetails, createOrUpdateSocialInsuranceCalculation, updateSocialInsuranceCalculation } from '../models/socialInsuranceCalculation';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';
import { NotFoundError } from '../errors/customError';

/**
 * Fetch social insurance calculation details by social insurance calculation ID.
 * @param req - Express request object
 * @param res - Express response object
 */ 
export const fetchSocialInsuranceCalculationDetailsHandler = async (req: Request, res: Response): Promise<void> => {

  try {
    const socialInsuranceCalculation = await getSocialInsuranceCalculationDetails();
    if (!socialInsuranceCalculation) {
      throw new NotFoundError('Social insurance calculation details not found');
    }

    sendSuccessResponse(res, socialInsuranceCalculation, 'Social insurance calculation details fetched successfully');
  } catch (error: any) {
    console.error('Error fetching social insurance calculation details:', error);
    handleErrorResponse(error, res);
  }
}

/**
 * Insert social insurance calculation details.
 * @param req - Express request object
 * @param res - Express response object
 */
export const addSocialInsuranceCalculationHandler = async (req: Request, res: Response): Promise<void> => {
  const socialInsuranceCalculation = req.body;

  try {
    await createOrUpdateSocialInsuranceCalculation(socialInsuranceCalculation);
    sendSuccessResponse(res, socialInsuranceCalculation, 'Social insurance calculation details added successfully');
  } catch (error: any) {
    console.error('Error adding social insurance calculation details:', error);
    handleErrorResponse(error, res);
  } 
}

/**
 * Update social insurance calculation details.
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateSocialInsuranceCalculationHandler = async (req: Request, res: Response): Promise<void> => {
  const { socialInsuranceCalculationId } = req.params;
  const socialInsuranceCalculationData = req.body;

  try {
    const updatedSocialInsuranceCalculation = await updateSocialInsuranceCalculation(parseInt(socialInsuranceCalculationId, 10), socialInsuranceCalculationData);
    sendSuccessResponse(res, updatedSocialInsuranceCalculation, 'Social insurance calculation details updated successfully');
  } catch (error: any) {
    console.error('Error updating social insurance calculation details:', error);
    handleErrorResponse(error, res);
  }
}
