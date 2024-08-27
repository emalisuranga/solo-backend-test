import { Request, Response } from 'express';
import { getSalarySlipDetails, updatePaymentDetailsRemarks } from '../models/salarySlip';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';
import { NotFoundError } from '../errors/customError';

/**
 * Get salary slip details for a given employee and payment details ID.
 * @param req - Express request object
 * @param res - Express response object
 */
export const fetchSalarySlipDetailHandler = async (req: Request, res: Response): Promise<void> => {
  const { employeeId, paymentDetailsId } = req.params;

  try {
    const salarySlip = await getSalarySlipDetails(parseInt(employeeId, 10), parseInt(paymentDetailsId, 10));

    if (!salarySlip || salarySlip.employeeId !== parseInt(employeeId, 10)) {
      throw new NotFoundError('Salary slip not found');
    }

    sendSuccessResponse(res, salarySlip, 'Salary slip fetched successfully');
  } catch (error: any) {
    console.error('Error fetching salary slip details:', error);
    handleErrorResponse(error, res);
  }
};

/**
 * Update remarks for a given payment details ID.
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateRemarksHandler = async (req: Request, res: Response): Promise<void> => {
  const { paymentDetailsId } = req.params;
  const { remarks } = req.body;

  try {
    const updatedPaymentDetails = await updatePaymentDetailsRemarks(parseInt(paymentDetailsId, 10), remarks);
    sendSuccessResponse(res, updatedPaymentDetails, 'Remarks updated successfully');
  } catch (error: any) {
    console.error('Error updating remarks:', error);
    handleErrorResponse(error, res);
  }
};