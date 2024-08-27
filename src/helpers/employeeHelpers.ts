import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/customError';
import { createOrUpdatePaidHolidays } from '../models/leaveManagement';

const prisma = new PrismaClient();

export const checkRelatedRecordsExist = async (employeeId: number) => {
  const bankDetailsExists = await prisma.bankDetails.findUnique({
    where: { employeeId },
  });

  const salaryDetailsExists = await prisma.salaryDetails.findUnique({
    where: { employeeId },
  });

  if (!bankDetailsExists || !salaryDetailsExists) {
    throw new NotFoundError("Related records not found");
  }
};

export const updatePaidHolidaysIfNecessary = async (employeeId: number, newJoinDate: Date) => {
  const currentPaidHoliday = await prisma.paidHolidays.findFirst({
    where: { employeeId, isValid: true },
  });

  const currentUsedLeave = currentPaidHoliday ? currentPaidHoliday.usedLeave : 0;
  await createOrUpdatePaidHolidays(employeeId, newJoinDate, currentUsedLeave);
};

export const formatToISOString = (date: Date | string): string => {
  return new Date(date).toISOString();
};