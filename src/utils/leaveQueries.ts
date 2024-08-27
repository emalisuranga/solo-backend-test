import prisma from '../config/prismaClient';
import { AdjustLeaveRequestParams } from '../types/leaveManagement';
import { NotFoundError } from '../errors/customError';

/**
 * Find employee by ID.
 * @param employeeId - The employee ID.
 * @returns The employee details.
 */
export const findEmployeeById = async (employeeId: number) => {
    const employee = await prisma.personalInfo.findUnique({
        where: { id: employeeId },
    });
    // if (!employee) throw new Error(`Employee with ID ${employeeId} does not exist.`);
    if (!employee) throw new NotFoundError(`Employee with ID ${employeeId} does not exist.`);
    return employee;
};

/**
 * Create a new paid holiday.
 * @param employeeId - The employee ID.
 * @param leaveValidity - The leave validity details.
 * @returns The created paid holiday.
 */
export const createPaidHoliday = async (employeeId: number, leaveValidity: any) => {
    return await prisma.paidHolidays.create({
        data: {
            employeeId,
            totalLeave: leaveValidity.totalCarryOverLeave,
            usedLeave: 0,
            remainingLeave: leaveValidity.totalCarryOverLeave,
            leaveStart: leaveValidity.startDate,
            leaveEnd: leaveValidity.endDate,
            lastUpdated: new Date(),
            isValid: true,
        },
    });
};

/**
 * Create a new leave request.
 * @param params - The leave request parameters.
 * @returns The created leave request.
 */
export const createLeaveRequest = async (params: AdjustLeaveRequestParams) => {
    const { employeeId, newTotalDays, salaryMonth, salaryYear } = params;

    // Ensure the employee exists
    await findEmployeeById(employeeId);

    return await prisma.leaveRequests.create({
        data: {
            employeeId,
            initialDays: newTotalDays,
            adjustedDays: newTotalDays,
            totalDays: newTotalDays,
            requestDate: new Date(),
            createdAt: new Date(),
            salaryMonth,
            salaryYear,
        },
    });
};

/**
 * Update the validity of a paid holiday.
 * @param paidHolidayId - The paid holiday ID.
 */
export const updatePaidHolidayValidity = async (paidHolidayId: number) => {
    await prisma.paidHolidays.update({
        where: { id: paidHolidayId },
        data: { isValid: false },
    });
};

/**
 * Find the latest leave request.
 * @param employeeId - The employee ID.
 * @param salaryMonth - The salary month.
 * @param salaryYear - The salary year.
 * @returns The latest leave request.
 */
export const findLatestLeaveRequest = async (employeeId: number, salaryMonth: number, salaryYear: number) => {
    return await prisma.leaveRequests.findFirst({
        where: {
            employeeId,
            salaryMonth,
            salaryYear,
        },
        orderBy: {
            requestDate: 'desc',
        },
        take: 1,
    });
};

/**
 * Update a leave request.
 * @param leaveRequestId - The leave request ID.
 * @param newTotalDays - The new total days.
 * @returns The updated leave request.
 */
export const updateLeaveRequest = async (leaveRequestId: number, newTotalDays: number) => {
    return await prisma.leaveRequests.update({
        where: { id: leaveRequestId },
        data: {
            adjustedDays: newTotalDays,
            totalDays: newTotalDays,
        },
    });
};

/**
 * Find a valid paid holiday.
 * @param employeeId - The employee ID.
 * @returns The valid paid holiday.
 */
export const findValidPaidHoliday = async (employeeId: number) => {
    return await prisma.paidHolidays.findFirst({
        where: { employeeId, isValid: true },
    });
};

/**
 * Adjust paid holidays based on the difference in days.
 * @param paidHolidayId - The paid holiday ID.
 * @param difference - The difference in days.
 */
export const adjustPaidHolidays = async (paidHolidayId: number, difference: number) => {
    if (difference > 0) {
        await prisma.paidHolidays.update({
            where: { id: paidHolidayId },
            data: {
                usedLeave: { increment: difference },
                remainingLeave: { decrement: difference },
                lastUpdated: new Date(),
            },
        });
    } else if (difference < 0) {
        await prisma.paidHolidays.update({
            where: { id: paidHolidayId },
            data: {
                usedLeave: { decrement: -difference },
                remainingLeave: { increment: -difference },
                lastUpdated: new Date(),
            },
        });
    }
};