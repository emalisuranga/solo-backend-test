import prisma from '../config/prismaClient';
import {  EmployeeCategory } from '@prisma/client';
import { Employee } from '../types/employee';
import { checkAndUpdateLeaveValidity } from './leaveManagement';
import { NotFoundError } from '../errors/customError';
import { calculateRemainingPaidVacationDays } from '../utils/leaveCalculations';
import { checkRelatedRecordsExist, updatePaidHolidaysIfNecessary } from '../helpers/employeeHelpers';

const prepareEmployeeData = (employee: Employee) => {
  const {
    joinDate: { value: joinDateValue },
    dateOfBirth: { value: dateOfBirthValue },
    spouseDeduction: { value: spouseDeductionValue },
    dependentDeduction: { value: dependentDeductionValue },
    basicSalary: { value: basicSalaryValue },
    transportationCosts: { value: transportationCostsValue },
    familyAllowance: { value: familyAllowanceValue },
    attendanceAllowance: { value: attendanceAllowanceValue },
    leaveAllowance: { value: leaveAllowanceValue },
    specialAllowance: { value: specialAllowanceValue },
    bankAccountNumber: { value: bankAccountNumberValue },
    bankName: { value: bankNameValue },
    branchCode: { value: branchCodeValue },
    firstName: { value: firstNameValue },
    lastName: { value: lastNameValue },
    furiganaFirstName: { value: furiganaFirstNameValue },
    furiganaLastName: { value: furiganaLastNameValue },
    phone: { value: phoneValue },
    address: { value: addressValue },
    department: { value: departmentValue },
    jobTitle: { value: jobTitleValue },
    employeeNumber: { value: employeeNumberValue },
    category: { value: categoryValue },
    subcategory: { value: subcategoryValue },
    ...otherDetails
  } = employee;

  const parsedJoinDate = new Date(joinDateValue);
  const parsedDateOfBirth = new Date(dateOfBirthValue);

  return {
    employeeData: {
      employeeNumber: String(employeeNumberValue),
      firstName: firstNameValue,
      lastName: lastNameValue,
      furiganaFirstName: furiganaFirstNameValue,
      furiganaLastName: furiganaLastNameValue,
      phone: phoneValue,
      address: addressValue,
      dateOfBirth: parsedDateOfBirth,
      joinDate: parsedJoinDate,
      department: departmentValue,
      jobTitle: jobTitleValue,
      spouseDeduction: Number(spouseDeductionValue),
      dependentDeduction: Number(dependentDeductionValue),
      category: categoryValue || undefined,
      subcategory: subcategoryValue,
    },
    bankDetailsData: {
      bankAccountNumber: bankAccountNumberValue,
      bankName: bankNameValue,
      branchCode: branchCodeValue,
    },
    salaryDetailsData: {
      basicSalary: parseFloat(basicSalaryValue),
      transportationCosts: parseFloat(transportationCostsValue),
      familyAllowance: parseFloat(familyAllowanceValue),
      attendanceAllowance: parseFloat(attendanceAllowanceValue),
      leaveAllowance: parseFloat(leaveAllowanceValue),
      specialAllowance: parseFloat(specialAllowanceValue),
    },
  };
};

export const createEmployee = async (employee: Employee) => {
  const { employeeData, bankDetailsData, salaryDetailsData } = prepareEmployeeData(employee);

  const result = await prisma.personalInfo.create({
    data: { 
      ...employeeData,
      bankDetails: { create: { ...bankDetailsData } },
      salaryDetails: { create: { ...salaryDetailsData } },
    },
    include: { salaryDetails: true, bankDetails: true },
  });

  await checkAndUpdateLeaveValidity(result.id);

  return result;
};

export const getAllEmployees = async () => {
  const result = await prisma.personalInfo.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      employeeNumber: true,
      firstName: true,
      lastName: true,
      phone: true,
      joinDate: true,
      department: true,
      category: true,
      subcategory: true,
      salaryDetails: {
        select: {
          basicSalary: true,
          transportationCosts: true,
          familyAllowance: true,
          attendanceAllowance: true,
          leaveAllowance: true,
          specialAllowance: true,
        },
      },
    }
  });
  result.sort((a, b) => Number(a.employeeNumber) - Number(b.employeeNumber));
  return result;
};

export const getEmployeeById = async (id: number) => {
  const employee = await prisma.personalInfo.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      employeeNumber: true,
      firstName: true,
      lastName: true,
      furiganaFirstName: true,
      furiganaLastName: true,
      phone: true,
      address: true,
      dateOfBirth: true,
      joinDate: true,
      department: true,
      jobTitle: true,
      spouseDeduction: true,
      dependentDeduction: true,
      category: true,
      subcategory: true,
      bankDetails: {
        select: {
          bankAccountNumber: true,
          bankName: true,
          branchCode: true,
        },
      },
      salaryDetails: {
        select: {
          basicSalary: true,
          transportationCosts: true,
          familyAllowance: true,
          attendanceAllowance: true,
          leaveAllowance: true,
          specialAllowance: true,
        },
      },
      paidHolidays: {
        select: {
          remainingLeave: true,
        },
        where: {
          isValid: true,
        },
      },
    },
  });

  if (!employee) {
    throw new NotFoundError(`Employee with ID ${id} does not exist.`);
  }

  const remainingPaidVacationDays = calculateRemainingPaidVacationDays(employee.paidHolidays);

  return { ...employee, remainingPaidVacationDays };
};

export const updateEmployee = async (id: number, employee: Employee) => {
  try {
    await checkRelatedRecordsExist(id);

    const existingEmployee = await prisma.personalInfo.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingEmployee) {
      throw new NotFoundError(`Employee with ID ${id} does not exist.`);
    }

    const { employeeData, bankDetailsData, salaryDetailsData } = prepareEmployeeData(employee);

    // Only update paid holidays if the join date has changed
    if (employeeData.joinDate.getTime() !== existingEmployee.joinDate.getTime()) {
      await updatePaidHolidaysIfNecessary(id, employeeData.joinDate);
    }

    const result = await prisma.personalInfo.update({
      where: { id },
      data: {
        ...employeeData,
        bankDetails: {
          update: { ...bankDetailsData },
        },
        salaryDetails: {
          update: { ...salaryDetailsData },
        },
      },
      include: { salaryDetails: true, bankDetails: true },
    });

    return result;
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    throw new Error('An error occurred while updating the employee.');
  }
};

export const deleteEmployee = async (id: number) => {
  const result = await prisma.$transaction(async (prisma) => {
    await prisma.bankDetails.deleteMany({
      where: { employeeId: id },
    });
    await prisma.salaryDetails.deleteMany({
      where: { employeeId: id },
    });
    const deletedEmployee = await prisma.personalInfo.delete({
      where: { id },
    });

    return deletedEmployee;
  });

  return result;
};

export const softDeleteEmployee = async (id: number) => {
  const employee = await prisma.personalInfo.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const updatedEmployee = await prisma.personalInfo.update({
    where: { id },
    data: {
      isDeleted: true,
      // employeeNumber: employee.employeeNumber + '_deleted',
    },
  });

  return updatedEmployee;
};

export const getEmployeeNamesAndIds = async (employeeCategory: EmployeeCategory) => {
  console.log(employeeCategory);
  const employees = await prisma.personalInfo.findMany({
    where: { isDeleted: false,
      category: employeeCategory
     },
    select: {
      id: true,
      employeeNumber: true,
      firstName: true,
      lastName: true,
    }
  });
  employees.sort((a, b) => Number(a.employeeNumber) - Number(b.employeeNumber));
  return employees;
};

// export const getEmployeeNamesAndIds = async (category: EmployeeCategory) => {
//   console.log(category);
//   let whereCondition: any = { isDeleted: false }; 

//   if (category === EmployeeCategory.MONTHLY_BASIC) {
//     whereCondition.category = {
//       in: [EmployeeCategory.EXECUTIVE, EmployeeCategory.NON_EXECUTIVE],
//     };
//   } else if (category === EmployeeCategory.HOURLY_BASIC || category === EmployeeCategory.DAILY_BASIC) {
//     whereCondition.category = category; 
//   }

//   // Fetch the employees based on the condition
//   const employees = await prisma.personalInfo.findMany({
//     where: whereCondition,
//     select: {
//       id: true,
//       employeeNumber: true,
//       firstName: true,
//       lastName: true,
//     },
//   });

//   // Sort the employees by employeeNumber
//   employees.sort((a, b) => Number(a.employeeNumber) - Number(b.employeeNumber));

//   return employees;
// };

export const getNextEmployeeNumber = async (category: EmployeeCategory): Promise<string> => {
  try {
    const prefixMap = {
      [EmployeeCategory.HOURLY_BASIC]: 'HW',
      [EmployeeCategory.DAILY_BASIC]: 'DW',
      [EmployeeCategory.MONTHLY_BASIC]: '',
    };
    const prefix = prefixMap[category] || '';

    const employee = await prisma.personalInfo.findFirst({
      select: { employeeNumber: true },
      where: {
        employeeNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        employeeNumber: 'desc', 
      },
      take: 1, 
    });

    if (!employee) {
      return prefix ? `${prefix}1` : '1';
    }

    const numericPart = parseInt(employee.employeeNumber.replace(prefix, ''), 10);

    if (isNaN(numericPart)) {
      return prefix ? `${prefix}1` : '1';
    }

    return prefix ? `${prefix}${numericPart + 1}` : `${numericPart + 1}`;
  } catch (error) {
    console.error('Error fetching employee number:', error);
    throw new Error('Unable to generate the next employee number.');
  }
};

export const getAllDeletedEmployees = async () => {
  const deletedEmployees = await prisma.personalInfo.findMany({
    where: {
      isDeleted: true,
    },
  });

  if (!deletedEmployees || deletedEmployees.length === 0) {
    throw new Error("No deleted employees found.");
  }

  return deletedEmployees;
};

export const undoDeleteEmployee = async (id: number) => {
  const employee = await prisma.personalInfo.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  if (!employee.isDeleted) {
    throw new Error("Employee is not deleted.");
  }

  const restoredEmployee = await prisma.personalInfo.update({
    where: { id },
    data: {
      isDeleted: false,
    },
  });

  return restoredEmployee;
};