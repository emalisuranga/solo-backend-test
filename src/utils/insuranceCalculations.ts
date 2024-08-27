import { getMonthlyRemunerationDetails } from '../models/monthlyRemuneration';
import { getSocialInsuranceCalculationDetails } from '../models/socialInsuranceCalculation';
import { calculateHealthInsurance, calculateEmployeePensionInsurance, calculateLongTermCareInsurance, calculateEmploymentInsurance } from '../helpers/insuranceCalculations';
import { calculateAge } from '../helpers/ageCalculation';
import { cache } from '../cache/cache';
import { InsuranceDeductions } from '../types/InsuranceCalculationInterfaces';


const socialInsuranceCalculationDetails = async () => {

  const socialInsuranceCalculationDetails = await getSocialInsuranceCalculationDetails();

  if (!socialInsuranceCalculationDetails) {
    throw new Error('Social insurance calculation details are null.');
  }

  return socialInsuranceCalculationDetails;
};

export const calculateEmploymentInsuranceAmount = async (monthlySalary: number): Promise<number> => {
  const {
    regularEmployeeInsurancePercentage,
    specialEmployeeInsurancePercentage,
  } = await socialInsuranceCalculationDetails();
  return calculateEmploymentInsurance(monthlySalary, regularEmployeeInsurancePercentage);
};

export const calculateInsuranceDeductions = async (totalEarnings: number, dateOfBirth: string): Promise<InsuranceDeductions> => {
  // Check if the result is in the cache
  if (cache.deductions && cache.deductions[totalEarnings]) {
    return cache.deductions[totalEarnings];
  }

  const {
    healthInsurancePercentage,
    longTermInsurancePercentage,
    employeePensionPercentage,
    pensionStartSalary,
    pensionEndSalary,
    pensionStartMonthlySalary,
    pensionEndMonthlySalary
  } = await socialInsuranceCalculationDetails();

  const monthlyRemunerations = await getMonthlyRemunerationDetails();

  let healthInsurance = 0;
  let employeePensionInsurance = 0;
  let longTermCareInsurance = 0;
  const age = calculateAge(dateOfBirth);

  for (const remuneration of monthlyRemunerations) {
    if (totalEarnings >= remuneration.remunerationStartSalary && totalEarnings < remuneration.remunerationEndSalary) {
      healthInsurance = calculateHealthInsurance(remuneration.monthlySalary, healthInsurancePercentage);
      employeePensionInsurance = calculateEmployeePensionInsurance(
        remuneration.monthlySalary,
        pensionStartSalary,
        pensionEndSalary,
        pensionStartMonthlySalary,
        pensionEndMonthlySalary,
        employeePensionPercentage
      );
      if (age > 40) {
        longTermCareInsurance = calculateLongTermCareInsurance(remuneration.monthlySalary, longTermInsurancePercentage);
      };
      break;
    }
  }

  const result: InsuranceDeductions = {
    healthInsurance,
    employeePensionInsurance,
    longTermCareInsurance
  };

  // Store the result in the cache
  cache.deductions[totalEarnings] = result;

  return result;
};

