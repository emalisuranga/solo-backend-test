export interface Salary {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  slipName: string,
  category: string;
  dateOfBirth: Date;
  workDetails: WorkDetails;
  earnings: Earnings;
  deductions: Deductions;
}

export interface WorkDetails {
  scheduledWorkingDays: number;
  numberOfWorkingDays: number;
  numberOfPaidHolidays: number;
  remainingPaidVacationDays: number;
  overtime: number;
  timeLate: number;
  timeLeavingEarly: number;
  numberOfNonPaidLeave: number;
  numberOfHolidayAllowanceDays: number;
}

export interface Earnings {
  basicSalary: number;
  overtimePay: number;
  transportationCosts: number;
  attendanceAllowance: number;
  familyAllowance: number;
  leaveAllowance: number;
  specialAllowance: number;
  holidayAllowance: number
}

export interface Deductions {
  healthInsurance: number;
  employeePensionInsurance: number;
  employmentInsurance: number;
  longTermCareInsurance: number;
  socialInsurance: number;
  incomeTax: number;
  residentTax: number;
  advancePayment: number;
  yearEndAdjustment: number;
  nonEmploymentDeduction: number;
  refundAmount: number;
}

export interface socialInsurance {
  healthInsurance: number;
  employeePensionInsurance: number;
  employmentInsurance: number;
  longTermCareInsurance: number;
}