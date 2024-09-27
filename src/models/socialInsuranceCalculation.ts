import prisma from '../config/prismaClient';
import { cache } from '../cache/cache';
import { InsuranceCalculationRates } from '../types/InsuranceCalculationInterfaces';
import { defaultData } from '../data/defaultInsuranceData';

/**
 * Fetch social insurance calculation details by employee ID and social insurance calculation ID.
 * @param employeeId - The ID of the employee
 * @param socialInsuranceCalculationId - The ID of the social insurance calculation
 * @returns The social insurance calculation details
 */
export const getSocialInsuranceCalculationDetails = async (): Promise<InsuranceCalculationRates> => {
  if (cache.socialInsuranceCalculation) {
    return cache.socialInsuranceCalculation;
  }

  const insuranceCalculation = await prisma.socialInsuranceCalculation.findFirst({
    select: {
      id: true,
      healthInsurancePercentage: true,
      longTermInsurancePercentage: true,
      employeePensionPercentage: true,
      regularEmployeeInsurancePercentage: true,
      specialEmployeeInsurancePercentage: true,
      pensionStartMonthlySalary: true,
      pensionEndMonthlySalary: true,
      pensionStartSalary: true,
      pensionEndSalary: true
    }
  });

  if (!insuranceCalculation) {
    const newInsuranceCalculation = await createOrUpdateSocialInsuranceCalculation(defaultData);
    cache.socialInsuranceCalculation = newInsuranceCalculation;
    return newInsuranceCalculation;
  }

  cache.socialInsuranceCalculation = insuranceCalculation;
  return insuranceCalculation;
};
/**
 * Insert new data into SocialInsuranceCalculation.
 * @param data - The data to be inserted
 * @returns The newly created social insurance calculation record
 */
export const createOrUpdateSocialInsuranceCalculation = async (data: InsuranceCalculationRates) => {
  const existingRecord = await prisma.socialInsuranceCalculation.findFirst();

  if (existingRecord) {
    return await prisma.socialInsuranceCalculation.update({
      where: { id: existingRecord.id },
      data: {
        ...data,
      },
    });
  } else {
    return await prisma.socialInsuranceCalculation.create({
      data: {
        ...data,
      },
    });
  }
};

/**
 * Update social insurance calculation details.
 * @param socialInsuranceCalculationId - The ID of the social insurance calculation
 * @param data - The data to be updated
 * @returns The updated social insurance calculation record
 */
export const updateSocialInsuranceCalculation = async (socialInsuranceCalculationId: number, data: InsuranceCalculationRates) => {
  const existingRecord = await prisma.socialInsuranceCalculation.findUnique({
    where: { id: socialInsuranceCalculationId },
  });

  if (!existingRecord) {
    throw new Error('Record not found');
  }

  return await prisma.socialInsuranceCalculation.update({
    where: { id: socialInsuranceCalculationId },
    data: {
      ...data,
    },
  });
};
