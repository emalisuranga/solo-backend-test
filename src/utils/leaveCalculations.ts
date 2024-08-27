import { fetchValidLeaveRecords } from '../models/leaveManagement';

/**
 * Calculate leave validity based on join date.
 * @param joinDate - The employee's join date.
 * @returns The leave validity details.
 */
export const  calculatePaidLeaveEntitlement = async (joinDate: Date, employeeId: number) => {
  const joinDateObj = new Date(joinDate);
  const today = new Date();

  const monthsOfService =
    (today.getFullYear() - joinDateObj.getFullYear()) * 12 +
    today.getMonth() - joinDateObj.getMonth();

  let currentYearLeave = 0;
  let startDate: Date;
  let endDate: Date;

  if (monthsOfService < 6) {
    // If less than 6 months of service, calculate the end date as 6 months from join date
    startDate = new Date(joinDateObj);
    endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 6);
  } else {
    const leaveEntitlements = [
      { months: 18, entitlement: 10 }, // 6 months to 1.5 years
      { months: 30, entitlement: 11 }, // 1.5 years to 2.5 years
      { months: 42, entitlement: 12 }, // 2.5 years to 3.5 years
      { months: 54, entitlement: 14 }, // 3.5 years to 4.5 years
      { months: 66, entitlement: 16 }, // 4.5 years to 5.5 years
      { months: 78, entitlement: 18 }, // 5.5 years to 6.5 years
      { months: Infinity, entitlement: 20 }, // 6.5 years and beyond
    ];

    const { entitlement } =
      leaveEntitlements.find(({ months }) => monthsOfService < months) ||
      leaveEntitlements[leaveEntitlements.length - 1];

    currentYearLeave = entitlement;

    if (monthsOfService < 18) {
      startDate = new Date(joinDateObj);
      startDate.setMonth(joinDateObj.getMonth() + 6);
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      startDate = new Date(joinDateObj);
      startDate.setMonth(joinDateObj.getMonth() + Math.floor(monthsOfService / 12) * 12);
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    }
  }

  // Calculate carry-over leave
  const carryOverLeave = await calculateLeaveWithCarryOver(employeeId, startDate);
   const totalCarryOverLeave = currentYearLeave + carryOverLeave;

  return {
    currentYearLeave,
    totalCarryOverLeave,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

/**
 * Calculate the difference between new total days and previous total days.
 * @param newTotalDays - The new total days.
 * @param previousTotalDays - The previous total days.
 * @returns The difference in days.
 */
export const calculateDifference = (newTotalDays: number, previousTotalDays: number): number => {
  return newTotalDays - previousTotalDays;
};

export const calculateRemainingPaidVacationDays = (paidHolidays: Array<{ remainingLeave: number }>): number => {
  return paidHolidays.reduce((acc, holiday) => acc + holiday.remainingLeave, 0);
};

export const calculateLeaveWithCarryOver = async ( employeeId: number, leaveStartDate: Date, carryOverExpirationYears: number = 2 ): Promise<number> => {

  // Fetch valid leave records
  const { lastYearLeave, twoYearsAgoLeave } = await fetchValidLeaveRecords(employeeId, leaveStartDate, carryOverExpirationYears);

  let totalCarryOverLeave = 0;

  // Check and calculate carry-over leave
  if (twoYearsAgoLeave.length > 0 && lastYearLeave.length > 0) {
    const totalTwoYearsAgoLeave = twoYearsAgoLeave.reduce((sum, record) => sum + record.remainingLeave, 0);
    const totalLastYearLeave = lastYearLeave.reduce((sum, record) => sum + record.remainingLeave, 0);
    totalCarryOverLeave = Math.max(totalLastYearLeave - totalTwoYearsAgoLeave, 0);
  } else if (lastYearLeave.length > 0) {
    totalCarryOverLeave = lastYearLeave.reduce((sum, record) => sum + record.remainingLeave, 0);
  }

  return totalCarryOverLeave;
};