import prisma from '../config/prismaClient'; // Ensure the correct path to prisma instance
import { PrismaClient } from '@prisma/client';
import {  createEmployee } from '../models/employee';
import { Employee } from '../types/employee';
import { checkAndUpdateLeaveValidity } from '../models/leaveManagement';

// Mocking Prisma and related functions
jest.mock('@prisma/client');
jest.mock('../models/leaveManagement');
const prismaMock = new PrismaClient();

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
      $transaction: jest.fn(),
      personalInfo: {
        create: jest.fn(),
      },
    })),
  }));
  
  describe('createEmployee', () => {
    const mockEmployee: Employee = {
      firstName: 'John',
      lastName: 'Doe',
      furiganaFirstName: 'ジョン',
      furiganaLastName: 'ドウ',
      phone: '1234567890',
      address: '123 Main St',
      dateOfBirth: '1990-01-01',
      joinDate: '2024-01-01',
      department: 'Engineering',
      spouseDeduction: 0,
      dependentDeduction: 0,
      bankAccountNumber: '12345678',
      bankName: 'Bank of Japan',
      branchCode: '001',
      basicSalary: 500000,
      transportationCosts: 20000,
      familyAllowance: 30000,
      attendanceAllowance: 10000,
      leaveAllowance: 15000,
      specialAllowance: 5000,
      salaryDetails: [],
    bankDetails: [],
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create an employee and update leave validity', async () => {
      const mockCreate = prismaMock.personalInfo.create as jest.Mock;
      mockCreate.mockResolvedValue({ id: 1 });
      
      const mockTransaction = prismaMock.$transaction as jest.Mock;
      mockTransaction.mockImplementation((callback) => callback(prismaMock));
  
      (checkAndUpdateLeaveValidity as jest.Mock).mockResolvedValue(true);
  
      const result = await createEmployee(mockEmployee);
  
      expect(result).toEqual({ id: 1 });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          firstName: mockEmployee.firstName,
          lastName: mockEmployee.lastName,
          furiganaFirstName: mockEmployee.furiganaFirstName,
          furiganaLastName: mockEmployee.furiganaLastName,
          phone: mockEmployee.phone,
          address: mockEmployee.address,
          dateOfBirth: new Date(mockEmployee.dateOfBirth),
          joinDate: new Date(mockEmployee.joinDate),
          department: mockEmployee.department,
          spouseDeduction: parseFloat(mockEmployee.spouseDeduction as unknown as string),
          dependentDeduction: parseFloat(mockEmployee.dependentDeduction as unknown as string),
          isDeleted: false,
          bankDetails: {
            create: {
              bankAccountNumber: mockEmployee.bankAccountNumber,
              bankName: mockEmployee.bankName,
              branchCode: mockEmployee.branchCode,
            },
          },
          salaryDetails: {
            create: {
              basicSalary: parseFloat(mockEmployee.basicSalary as unknown as string),
              transportationCosts: parseFloat(mockEmployee.transportationCosts as unknown as string),
              familyAllowance: parseFloat(mockEmployee.familyAllowance as unknown as string),
              attendanceAllowance: parseFloat(mockEmployee.attendanceAllowance as unknown as string),
              leaveAllowance: parseFloat(mockEmployee.leaveAllowance as unknown as string),
              specialAllowance: parseFloat(mockEmployee.specialAllowance as unknown as string),
            },
          },
        },
      });
  
      expect(checkAndUpdateLeaveValidity).toHaveBeenCalledWith(1);
    });
  
    it('should throw an error if something goes wrong', async () => {
      const mockCreate = prismaMock.personalInfo.create as jest.Mock;
      mockCreate.mockRejectedValue(new Error('Creation failed'));
  
      const mockTransaction = prismaMock.$transaction as jest.Mock;
      mockTransaction.mockImplementation((callback) => callback(prismaMock));
  
      await expect(createEmployee(mockEmployee)).rejects.toThrow('Creation failed');
  
      expect(mockCreate).toHaveBeenCalled();
      expect(checkAndUpdateLeaveValidity).not.toHaveBeenCalled();
    });
  });