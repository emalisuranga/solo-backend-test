import { Salary } from '../types/salary';
import { calculateIncomeTax } from '../helpers/incomeTaxCalculations';
import { formatToISOString } from '../helpers/employeeHelpers';
import { calculateEmploymentInsuranceAmount } from './insuranceCalculations';
import { calculateInsuranceDeductions } from './insuranceCalculations';
import {
    calculateTotalEarnings,
    calculateTotalDeductions,
    calculateSocialInsurance,
    convertToNegative,
    checkEarningsMatch
} from '../helpers/salaryCalculations';

export const calculateSalaryDetails = async (salary: Salary) => {
    const dateOfBirthISO = formatToISOString(salary.dateOfBirth);
    const totalEarnings = calculateTotalEarnings(salary.earnings , salary.deductions.nonEmploymentDeduction, salary.workDetails.numberOfWorkingDays, salary.category);	
    // Check if earnings match existing records
    if (!await checkEarningsMatch(totalEarnings, salary.id)) {
        return calculateFullSalaryDetails(salary, totalEarnings, dateOfBirthISO);
    }

    // Return existing salary details if earnings match
    return mapExistingSalaryDetails(salary, totalEarnings);
};



const calculateFullSalaryDetails = async (salary: Salary, totalEarnings: number, dateOfBirthISO: string) => {
    const employmentInsurance = await calculateEmploymentInsuranceAmount(totalEarnings);
    const insuranceDeductions = await calculateInsuranceDeductions(totalEarnings, dateOfBirthISO);
    const socialInsurance = calculateSocialInsurance({ ...insuranceDeductions, employmentInsurance });
    const taxableIncome = totalEarnings - socialInsurance;
    const incomeTax = await calculateIncomeTax(taxableIncome, salary.employeeId);
    // const refundAmount = calculateRefundAmount(salary.deductions.refundAmount, incomeTax);
    const totalDeductions = calculateTotalDeductions({
        ...salary.deductions,
        refundAmount: convertToNegative(incomeTax),
        incomeTax,
        employmentInsurance,
    });
    const netSalary = totalEarnings - totalDeductions;

    return {
        overtimePayment: salary.earnings.overtimePay,
        totalEarnings,
        employmentInsurance,
        socialInsurance,
        taxableIncome,
        incomeTax,
        refundAmount: convertToNegative(incomeTax),
        totalDeductions,
        netSalary,
        insuranceDeductions,
    };
};

const calculateRefundAmount = (existingRefundAmount: number, incomeTax: number): number => {
    return existingRefundAmount === 0 ? incomeTax : existingRefundAmount;
};

const mapExistingSalaryDetails = (salary: Salary, totalEarnings: number) => {
    const {
        deductions: {
            employmentInsurance,
            socialInsurance,
            incomeTax,
            refundAmount,
            healthInsurance,
            employeePensionInsurance,
            longTermCareInsurance,
        },
    } = salary;

    return {
        overtimePayment: salary.earnings.overtimePay,
        totalEarnings,
        employmentInsurance,
        socialInsurance,
        taxableIncome: socialInsurance,
        incomeTax,
        refundAmount,
        totalDeductions: socialInsurance,
        netSalary: totalEarnings - socialInsurance,
        insuranceDeductions: {
            healthInsurance,
            employeePensionInsurance,
            longTermCareInsurance,
        },
    };
};