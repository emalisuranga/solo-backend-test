import { Request, Response } from 'express';
import { createInitialLeaveRequest as createInitialLeaveRequestModel } from '../models/leaveManagement';
import { LeaveRequests } from '../types/leaveManagement';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';

export const createInitialLeaveRequestHandler = async (req: Request, res: Response) => {
    try {
        const leaveRequest: LeaveRequests = req.body;
        const result = await createInitialLeaveRequestModel(leaveRequest);
        sendSuccessResponse(res, result, 'Leave request created successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};