import { SocialInsuranceCalculation } from '../types/socialInsuranceCalculation'; // Adjust the import path as needed

export const defaultData: SocialInsuranceCalculation = {
  longTermInsurancePercentage: 0.1158,
  healthInsurancePercentage: 0.0998,
  employeePensionPercentage: 0.186,
  pensionStartSalary: 93000,
  pensionEndSalary: 665000,
  regularEmployeeInsurancePercentage: 0.006,
  specialEmployeeInsurancePercentage: 0.007,
  pensionStartMonthlySalary: 88000, 
  pensionEndMonthlySalary: 650000,
  createdAt: new Date(),
  updatedAt: new Date()
};