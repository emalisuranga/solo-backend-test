import { Request, Response } from 'express';
import { addSalaryDetails, getSalaryDetailsByMonth, getSalaryDetailsByPaymentId, updateSalaryDetails, deleteSalaryDetails } from '../models/salary';
import { calculateSalaryDetails } from '../utils/calculateSalaryDetails';
import { calculateIncomeTax } from '../helpers/incomeTaxCalculations';
import { Salary } from '../types/salary';
import { CustomError } from '../errors/customError';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';
import { calculateTaxableIncome, applyCalculatedDetailsToSalary } from '../helpers/salaryCalculations';

export const addSalaryDetailsHandler = async (req: Request, res: Response) => {
    const salary: Salary = req.body;

    try {
        const createdSalary = await addSalaryDetails(salary);
        sendSuccessResponse(res, createdSalary, 'Salary details added successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const getSalaryDetailsByMonthHandler = async (req: Request, res: Response) => {
    const { month, year } = req.params;

    try {
        const parsedMonth = parseInt(month, 10);
        const parsedYear = parseInt(year, 10);

        if (isNaN(parsedMonth) || isNaN(parsedYear)) {
            throw new CustomError('Invalid month or year parameter', 400);
        }

        const salaryDetails = await getSalaryDetailsByMonth(parsedMonth, parsedYear);
        sendSuccessResponse(res, salaryDetails, 'Salary details fetched successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const getSalaryDetailsByPaymentIdHandler = async (req: Request, res: Response) => {
    const { paymentId } = req.params;

    try {
        const salaryDetails = await getSalaryDetailsByPaymentId(Number(paymentId));

        if (!salaryDetails) {
            throw new CustomError('No salary details found for the specified payment ID', 404);
        }

        sendSuccessResponse(res, salaryDetails, 'Salary details fetched successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const updateSalaryDetailsHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const salaryData = req.body;

    try {
        const updatedSalary = await updateSalaryDetails(parseInt(id), salaryData);
        sendSuccessResponse(res, updatedSalary, 'Salary details updated successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const deleteSalaryDetailsHandler = async (req: Request, res: Response) => {
    const { paymentId } = req.params;

    try {
        const deletedSalaryDetails = await deleteSalaryDetails(parseInt(paymentId));
        sendSuccessResponse(res, deletedSalaryDetails, 'Salary details deleted successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const calculateSalaryDetailsHandler = async (req: Request, res: Response) => {
    try {
        const salary: Salary = req.body; 
        const calculatedDetails = await calculateSalaryDetails(salary);
        applyCalculatedDetailsToSalary(salary, calculatedDetails);

        sendSuccessResponse(res, salary, 'Salary details calculated successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const calculateIncomeTaxHandler = async (req: Request, res: Response) => {
    try {
        const { earnings, nonEmploymentDeduction, socialInsurance, employeeId } = req.body;

        const { taxableIncome, socialInsuranceAmount }  = calculateTaxableIncome(earnings, nonEmploymentDeduction, socialInsurance);
        const incomeTax = await calculateIncomeTax(taxableIncome, employeeId);

        const responseData = {
            incomeTax: incomeTax,
            socialInsuranceAmount: socialInsuranceAmount,
            taxableIncome: taxableIncome, 
        };

        sendSuccessResponse(res, responseData, 'Income Tax calculated successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};