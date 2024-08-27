export interface InsuranceCalculationRates {
  healthInsurancePercentage: number;
  longTermInsurancePercentage: number;
  employeePensionPercentage: number;
  regularEmployeeInsurancePercentage: number;
  specialEmployeeInsurancePercentage: number;
  pensionStartSalary: number; 
  pensionEndSalary: number;
  pensionStartMonthlySalary: number;
  pensionEndMonthlySalary: number;
}
  
  export interface MonthlySalaryRange {
    monthlySalary: number;
    remunerationStartSalary: number;
    remunerationEndSalary: number;
  }
  
  export interface InsuranceDeductions {
    healthInsurance: number;
    employeePensionInsurance: number;
    longTermCareInsurance: number;
  }
  
  export interface InsuranceCalculationCache {
    socialInsuranceCalculation: InsuranceCalculationRates | null;
    monthlyRemunerations: MonthlySalaryRange[] | null;
    deductions: { [key: number]: InsuranceDeductions };
  }