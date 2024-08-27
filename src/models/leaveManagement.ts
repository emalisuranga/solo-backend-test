import prisma from '../config/prismaClient';
import { AdjustLeaveRequestParams } from '../types/leaveManagement';
import {
    calculatePaidLeaveEntitlement,
    calculateDifference
} from '../utils/leaveCalculations';
import {
    findEmployeeById,
    createPaidHoliday,
    createLeaveRequest,
    updatePaidHolidayValidity,
    findLatestLeaveRequest,
    updateLeaveRequest,
    findValidPaidHoliday,
    adjustPaidHolidays
} from '../utils/leaveQueries';
import { PaidHolidays } from '../types/leaveManagement';

export const createOrUpdatePaidHolidays = async (employeeId: number, joinDate: Date, currentUsedLeave: number) => {
    const leaveValidity = await calculatePaidLeaveEntitlement(joinDate, employeeId);

    await prisma.paidHolidays.updateMany({
        where: { employeeId, isValid: true },
        data: { isValid: false },
    });

    await prisma.paidHolidays.create({
        data: {
            employeeId,
            totalLeave: leaveValidity.totalCarryOverLeave,
            usedLeave: currentUsedLeave,
            remainingLeave: leaveValidity.totalCarryOverLeave - currentUsedLeave,
            leaveStart: leaveValidity.startDate,
            leaveEnd: leaveValidity.endDate,
            lastUpdated: new Date(),
            isValid: true
        },
    });
};

export const checkAndUpdateLeaveValidity = async (employeeId: number) => {
    let paidHoliday = await prisma.paidHolidays.findFirst({
        where: { employeeId, isValid: true },
    });

    const now = new Date();

    if (!paidHoliday) {
        const employee = await findEmployeeById(employeeId);
        const leaveValidity = await calculatePaidLeaveEntitlement(employee.joinDate, employeeId);
        paidHoliday = await createPaidHoliday(employeeId, leaveValidity);
    } else if (paidHoliday.leaveEnd < now) {
        await updatePaidHolidayValidity(paidHoliday.id);
        const employee = await findEmployeeById(employeeId);
        const leaveValidity = await calculatePaidLeaveEntitlement(employee.joinDate, employeeId);
        paidHoliday = await createPaidHoliday(employeeId, leaveValidity);
    }

    return paidHoliday.id;
};

export const createInitialLeaveRequest = async (leaveRequest: { employeeId: number; totalDays: number; salaryMonth: number; salaryYear: number }) => {
    const employee = await prisma.personalInfo.findUnique({
        where: { id: leaveRequest.employeeId, isDeleted: false },
    });

    if (!employee) {
        throw new Error(`Employee with ID ${leaveRequest.employeeId} does not exist.`);
    }

    const paidHolidayId = await checkAndUpdateLeaveValidity(leaveRequest.employeeId);
    const newLeaveRequest = await createLeaveRequest({
        employeeId: leaveRequest.employeeId,
        newTotalDays: leaveRequest.totalDays,
        salaryMonth: leaveRequest.salaryMonth,
        salaryYear: leaveRequest.salaryYear,
    });

    const updatedPaidHolidays = await prisma.paidHolidays.update({
        where: { id: paidHolidayId },
        data: {
            usedLeave: { increment: leaveRequest.totalDays },
            remainingLeave: { decrement: leaveRequest.totalDays },
            lastUpdated: new Date(),
        },
    });

    return { newLeaveRequest, updatedPaidHolidays };
};

export const adjustLeaveRequest = async (params: AdjustLeaveRequestParams) => {
    const { employeeId, newTotalDays, salaryMonth, salaryYear } = params;

    let leaveRequest = await findLatestLeaveRequest(employeeId, salaryMonth, salaryYear);

    if (!leaveRequest) {
        leaveRequest = await createLeaveRequest(params);
    }

    const difference = calculateDifference(newTotalDays, leaveRequest.totalDays);
    const updatedLeaveRequest = await updateLeaveRequest(leaveRequest.id, newTotalDays);

    const paidHoliday = await findValidPaidHoliday(leaveRequest.employeeId);

    if (!paidHoliday) {
        throw new Error(`PaidHolidays entry for employee ID ${leaveRequest.employeeId} does not exist.`);
    }

    await adjustPaidHolidays(paidHoliday.id, difference);

    return updatedLeaveRequest;
};

export const fetchValidLeaveRecords = async (
  employeeId: number,
  leaveStartDate: Date,
  expirationYears: number = 2
): Promise<{ lastYearLeave: PaidHolidays[]; twoYearsAgoLeave: PaidHolidays[] }> => {
  const lastYearDate = new Date(leaveStartDate);
  const twoYearsAgoDate = new Date(leaveStartDate);

  lastYearDate.setFullYear(leaveStartDate.getFullYear() - 1);
  twoYearsAgoDate.setFullYear(leaveStartDate.getFullYear() - expirationYears);

  // Fetch records for the last year (within the same month and day)
  const lastYearLeave: PaidHolidays[] = await prisma.paidHolidays.findMany({
    where: {
      employeeId: employeeId,
      leaveStart: {
        gte: lastYearDate,
        lt: leaveStartDate,
      },
    },
    orderBy: {
      leaveStart: 'asc',
    },
  });

  // Fetch records for two years ago (within the same month and day)
  const twoYearsAgoLeave: PaidHolidays[] = await prisma.paidHolidays.findMany({
    where: {
      employeeId: employeeId,
      leaveStart: {
        gte: twoYearsAgoDate,
        lt: lastYearDate,
      },
    },
    orderBy: {
      leaveStart: 'asc',
    },
  });

  // Handle empty records
  return {
    lastYearLeave: lastYearLeave.length ? lastYearLeave : [],
    twoYearsAgoLeave: twoYearsAgoLeave.length ? twoYearsAgoLeave : [],
  };
};
