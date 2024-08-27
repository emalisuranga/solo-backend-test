import prisma from '../config/prismaClient';
import { IncomeTaxDeductionRates } from '../types/IncomeTaxDeductionRates';
import { defaultData } from '../data/defaultIncomeTaxDeductionsData';
import { cache } from '../cache/cache';

// let cacheIncomeTaxDeduction: IncomeTaxDeductionRates | null = null;
  
  /**
   * Fetch income tax deduction details by employee ID.
   * @param employeeId - The ID of the employee
   * @returns The income tax deduction details
   */
  export const getIncomeTaxDeductionDetails = async (): Promise<IncomeTaxDeductionRates> => {
    if (cache.incomeTaxDeduction) {
      return cache.incomeTaxDeduction;
    }
  
    const deduction = await prisma.incomeTaxDeduction.findFirst({
      select: {
        spouseDeduction: true,
        dependentDeduction: true,
        basicDeduction: true,
      }
    });
  
    if (!deduction) {
      const newDeduction = await createOrUpdateIncomeTaxDeduction(defaultData);
      cache.incomeTaxDeduction = newDeduction;
      return newDeduction;
    }
    cache.incomeTaxDeduction = deduction;
    return deduction;
  };
  
  /**
   * Insert new data into IncomeTaxDeduction or update if it exists.
   * @param data - The data to be inserted or updated
   * @returns The newly created or updated income tax deduction record
   */
  export const createOrUpdateIncomeTaxDeduction = async (data: IncomeTaxDeductionRates) => {
    const existingRecord = await prisma.incomeTaxDeduction.findFirst();
  
    if (existingRecord) {
      return await prisma.incomeTaxDeduction.update({
        where: { id: existingRecord.id },
        data: {
          ...data,
        },
      });
    } else {
      return await prisma.incomeTaxDeduction.create({
        data: {
          ...data,
        },
      });
    }
  };