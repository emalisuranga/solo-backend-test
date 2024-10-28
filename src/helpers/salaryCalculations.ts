import { Salary, Earnings, socialInsurance } from '../types/salary';
import { getSalaryDetailsByPaymentId } from '../models/salary';

/**
 * Calculate the total earnings.
 * @param earnings - The earnings details.
 * @param overtimePayment - The overtime payment.
 * @returns The total earnings.
 */
export const calculateTotalEarnings = (earnings: Salary['earnings'], nonEmploymentDeduction: number, numberOfWorkingDays: number, category: string): number => {
    const baseEarnings = calculateBaseEarnings(category, earnings.basicSalary, numberOfWorkingDays);

  return (
    baseEarnings +
    earnings.transportationCosts +
    earnings.attendanceAllowance +
    earnings.familyAllowance +
    earnings.leaveAllowance +
    earnings.specialAllowance +
    earnings.holidayAllowance +
    earnings.overtimePay -
    nonEmploymentDeduction
  );
};

/**
 * Calculate the total deductions.
 * @param deductions - The deductions details.
 * @returns The total deductions.
 */
export const calculateTotalDeductions = (
    deductions: Salary['deductions']
): number => {
    return (
        deductions.healthInsurance +
        deductions.employeePensionInsurance +
        deductions.longTermCareInsurance +
        deductions.residentTax +
        deductions.advancePayment +
        deductions.yearEndAdjustment +
        deductions.refundAmount +
        deductions.incomeTax +
        deductions.employmentInsurance
    );
};


/**
 * Calculate overtime payment.
 * @param workDetails - The work details.
 * @param basicSalary - The basic salary.
 * @returns The overtime payment.
 */
// export const calculateOvertimePayment = (workDetails: Salary['workDetails'], basicSalary: number): number => {
//     const { scheduledWorkingDays, overtime } = workDetails;
//     const calculatedValue = (((basicSalary / scheduledWorkingDays) / 8) * 1.25) * overtime;
//     return Math.floor(calculatedValue) + (calculatedValue % 1 !== 0 ? 1 : 0);
// };

/**
 * Calculate social insurance.
 * @param deductions - The deductions details.
 * @returns The social insurance.
 */
export const calculateSocialInsurance = (deductions: { healthInsurance: number, employeePensionInsurance: number, longTermCareInsurance: number, employmentInsurance: number }): number => {
    return deductions.healthInsurance + deductions.employeePensionInsurance + deductions.longTermCareInsurance + deductions.employmentInsurance;
};

export const convertToNegative = (value: number): number => {
    return -Math.abs(value);
};

export const calculateTaxableIncome = (earnings: Earnings, nonEmploymentDeduction: number, socialInsurance: socialInsurance, category: string, numberOfWorkingDays: number): { taxableIncome: number; socialInsuranceAmount: number } => {
    const totalEarnings = calculateTotalEarnings(earnings, nonEmploymentDeduction, numberOfWorkingDays, category);
    const socialInsuranceAmount = calculateSocialInsurance(socialInsurance);
    const taxableIncome = totalEarnings - socialInsuranceAmount;
    return { taxableIncome, socialInsuranceAmount};
};

export const checkEarningsMatch = async (currentEarnings: number, paymentId: number): Promise<boolean> => {
    try {
      const salaryDetails = await getSalaryDetailsByPaymentId(paymentId);
  
      if (!salaryDetails?.earnings) {
        console.warn('Salary details or earnings are missing.');
        return false;
      }
      const totalExistingEarnings = salaryDetails.totalEarnings;
      return totalExistingEarnings === currentEarnings;
    } catch (error) {
      console.error('Error checking earnings match:', error);
      return false;
    }
  };

  export const applyCalculatedDetailsToSalary = (salary: Salary, calculatedDetails: any) => {
    salary.deductions.employmentInsurance = calculatedDetails.employmentInsurance;
    salary.deductions.socialInsurance = calculatedDetails.socialInsurance;
    salary.deductions.incomeTax = calculatedDetails.incomeTax;
    salary.deductions.refundAmount = calculatedDetails.refundAmount;
    salary.deductions.healthInsurance = calculatedDetails.insuranceDeductions.healthInsurance;
    salary.deductions.employeePensionInsurance = calculatedDetails.insuranceDeductions.employeePensionInsurance;
    salary.deductions.longTermCareInsurance = calculatedDetails.insuranceDeductions.longTermCareInsurance;
};

export const calculateBaseEarnings = (
  category: string,
  basicSalary: number,
  numberOfWorkingDays: number
): number => {
  let calculatedValue: number;

  switch (category) {
    case 'DAILY_BASIC':
    case 'HOURLY_BASIC':
      calculatedValue = basicSalary * numberOfWorkingDays;
      break;
    case 'MONTHLY_BASIC':
      calculatedValue = basicSalary;
      break;
    default:
      throw new Error(`Invalid category: ${category}`);
  }
  return Math.floor(calculatedValue) + (calculatedValue % 1 !== 0 ? 1 : 0);
};