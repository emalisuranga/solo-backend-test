import prisma from '../config/prismaClient';
import { Employee } from '../types/employee';
import { checkAndUpdateLeaveValidity } from './leaveManagement';
import { NotFoundError } from '../errors/customError';
import { calculateRemainingPaidVacationDays } from '../utils/leaveCalculations';
import { checkRelatedRecordsExist, updatePaidHolidaysIfNecessary } from '../helpers/employeeHelpers';

export const createEmployee = async (employee: Employee) => {
  const result = await prisma.personalInfo.create({
    data: {
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      furiganaFirstName: employee.furiganaFirstName,
      furiganaLastName: employee.furiganaLastName,
      phone: employee.phone,
      address: employee.address,
      dateOfBirth: new Date(employee.dateOfBirth),
      joinDate: new Date(employee.joinDate),
      department: employee.department,
      jobTitle: employee.jobTitle,
      spouseDeduction: parseFloat(employee.spouseDeduction as unknown as string),
      dependentDeduction: parseFloat(employee.dependentDeduction as unknown as string),
      isDeleted: false,
      bankDetails: {
        create: {
          bankAccountNumber: employee.bankAccountNumber,
          bankName: employee.bankName,
          branchCode: employee.branchCode,
        },
      },
      salaryDetails: {
        create: {
          basicSalary: parseFloat(employee.basicSalary as unknown as string),
          transportationCosts: parseFloat(employee.transportationCosts as unknown as string),
          familyAllowance: parseFloat(employee.familyAllowance as unknown as string),
          attendanceAllowance: parseFloat(employee.attendanceAllowance as unknown as string),
          leaveAllowance: parseFloat(employee.leaveAllowance as unknown as string),
          specialAllowance: parseFloat(employee.specialAllowance as unknown as string),
        },
      },
    },
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

  await checkRelatedRecordsExist(id);
  const existingEmployee = await prisma.personalInfo.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingEmployee) {
    throw new NotFoundError(`Employee with ID ${id} does not exist.`);
  }

  const { joinDate, dateOfBirth, ...otherDetails } = employee;

  if (joinDate && new Date(joinDate).getTime() !== existingEmployee.joinDate.getTime()) {
    await updatePaidHolidaysIfNecessary(id, new Date(joinDate));
  }

  const result = await prisma.personalInfo.update({
    where: { id },
    data: {
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      furiganaFirstName: employee.furiganaFirstName,
      furiganaLastName: employee.furiganaLastName,
      phone: employee.phone,
      address: employee.address,
      dateOfBirth: new Date(employee.dateOfBirth),
      joinDate: new Date(employee.joinDate),
      department: employee.department,
      jobTitle: employee.jobTitle,
      spouseDeduction: parseFloat(employee.spouseDeduction as unknown as string),
      dependentDeduction: parseFloat(employee.dependentDeduction as unknown as string),
      bankDetails: {
        update: {
          bankAccountNumber: employee.bankAccountNumber,
          bankName: employee.bankName,
          branchCode: employee.branchCode,
        },
      },
      salaryDetails: {
        update: {
          basicSalary: parseFloat(employee.basicSalary as unknown as string),
          transportationCosts: parseFloat(employee.transportationCosts as unknown as string),
          familyAllowance: parseFloat(employee.familyAllowance as unknown as string),
          attendanceAllowance: parseFloat(employee.attendanceAllowance as unknown as string),
          leaveAllowance: parseFloat(employee.leaveAllowance as unknown as string),
          specialAllowance: parseFloat(employee.specialAllowance as unknown as string),
        },
      },
    },
    include: { salaryDetails: true, bankDetails: true },
  });

  return result;
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
      employeeNumber: employee.employeeNumber + '_deleted', 
    },
  });

  return updatedEmployee;
};

export const getEmployeeNamesAndIds = async () => {
  const employees = await prisma.personalInfo.findMany({
    where: { isDeleted: false },
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