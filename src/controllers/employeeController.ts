import { Request, Response } from 'express';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeeNamesAndIds,
    softDeleteEmployee,
    getNextEmployeeNumber,
    getAllDeletedEmployees,
    undoDeleteEmployee
} from '../models/employee';
import { Employee } from '../types/employee';
import { sendSuccessResponse, handleErrorResponse } from '../utils/responseHandler';
import { EmployeeCategory } from '../types/employeeCategory.type';

export const createEmployeeHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const employee: Employee = req.body;
      const result = await createEmployee(employee);
      sendSuccessResponse(res, result, 'Employee added successfully');
    } catch (error) {
      console.error('Failed to create employee:', error);
      handleErrorResponse(error, res);
    }
  };

export const getAllEmployeesHandler = async (_req: Request, res: Response) => {
    try {
        const result = await getAllEmployees();
        sendSuccessResponse(res, result, 'Employees retrieved successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};

export const getEmployeeByIdHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const employee = await getEmployeeById(parseInt(id, 10));
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        sendSuccessResponse(res, employee, 'Employee retrieved successfully');
    } catch (error) {
        handleErrorResponse(error, res);
    }
};

export const updateEmployeeHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const employee: Employee = req.body;
    try {
        const result = await updateEmployee(parseInt(id, 10), employee);
        sendSuccessResponse(res, result, 'Employee updated successfully');
    } catch (error) {
        console.error('Error updating employee:', error);
        handleErrorResponse(error, res);
    }
};

export const deleteEmployeeHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteEmployee(parseInt(id, 10));
        sendSuccessResponse(res, result, 'Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        handleErrorResponse(error, res);
    }
};

export const getEmployeeNamesAndIdsHandler = async (_req: Request, res: Response) => {
    try {
        const result = await getEmployeeNamesAndIds();
        sendSuccessResponse(res, result, 'Employees retrieved successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};

export const softDeleteEmployeeHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const employee = await softDeleteEmployee(id);
        sendSuccessResponse(res, employee, 'Employee soft deleted successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};

export const getNextEmployeeNumberHandler = async (req: Request, res: Response) => {
    try {
        const { employeeCategory } = req.params;
        const category = EmployeeCategory[employeeCategory.toUpperCase() as keyof typeof EmployeeCategory];

        // Check if the category is valid
        if (!category) {
          return res.status(400).json({ message: 'Invalid employee category' });
        }
        const nextEmployeeNumber = await getNextEmployeeNumber(category);
        sendSuccessResponse(res, { nextEmployeeNumber }, 'Next employee number fetched successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};

export const getAllDeletedEmployeesHandler = async (req: Request, res: Response) => {
    try {
        const deletedEmployees = await getAllDeletedEmployees();
        sendSuccessResponse(res, deletedEmployees, 'Deleted employees retrieved successfully');
    } catch (error) {
        console.error('Error details:', error);
        handleErrorResponse(error, res);
    }
};

export const undoDeleteEmployeeHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get employee ID from request parameters
        const restoredEmployee = await undoDeleteEmployee(Number(id)); // Convert ID to a number if it's passed as a string
        sendSuccessResponse(res, restoredEmployee, 'Employee restored successfully');
    } catch (error) {
        console.error('Error restoring employee:', error);
        handleErrorResponse(error, res);
    }
};