export interface Employee {
  employeeNumber: { value: string };
  basicSalary: { value: string };
  transportationCosts: { value: string };
  familyAllowance: { value: string };
  attendanceAllowance: { value: string };
  leaveAllowance: { value: string };
  specialAllowance: { value: string };
  bankAccountNumber: { value: string };
  bankName: { value: string };
  branchCode: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  furiganaFirstName: { value: string };
  furiganaLastName: { value: string };
  phone: { value: string };
  address: { value: string };
  dateOfBirth: { value: string | Date };
  joinDate: { value: string | Date };
  department: { value: string };
  jobTitle: { value: string };
  spouseDeduction: { value: number };
  dependentDeduction: { value: number };
}