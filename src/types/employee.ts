export interface Employee {
    salaryDetails: any;
    bankDetails: any;
    firstName: string;
    lastName: string;
    furiganaFirstName: string;
    furiganaLastName: string;
    phone: string;
    address: string;
    dateOfBirth: string | Date;
    joinDate: string | Date;
    department: string;
    bankAccountNumber: string;
    bankName: string;
    branchCode: string;
    basicSalary: number;
    transportationCosts: number;
    familyAllowance: number;
    attendanceAllowance: number;
    leaveAllowance: number;
    specialAllowance: number;
    dependentDeduction: number;
    spouseDeduction: number;
  }