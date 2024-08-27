export const calculateHealthInsurance = (monthlySalary: number, percentage: number): number => {
    return (monthlySalary * percentage) / 2;
  };
  
  export const calculateEmployeePensionInsurance = (
    monthlySalary: number,
    pensionStartSalary: number,
    pensionEndSalary: number,
    pensionStartMonthlySalary: number,
    pensionEndMonthlySalary: number,
    percentage: number
  ): number => {
    if (monthlySalary < pensionStartSalary) {
      return (pensionStartMonthlySalary * percentage) / 2;
    } else if (monthlySalary > pensionEndSalary) {
      return (pensionEndMonthlySalary * percentage) / 2;
    } else {
      return (monthlySalary * percentage) / 2;
    }
  };
  
  export const calculateLongTermCareInsurance = (monthlySalary: number, percentage: number): number => {
    return (monthlySalary * percentage) / 2;
  };
  
  export const calculateEmploymentInsurance = (monthlySalary: number, percentage: number): number => {
    return Math.ceil(monthlySalary * percentage);
  };