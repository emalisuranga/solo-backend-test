import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch salary slip details by employee ID and payment details ID.
 * @param employeeId - The ID of the employee
 * @param paymentDetailsId - The ID of the payment details
 * @returns The salary slip details
 */
export const getSalarySlipDetails = async (employeeId: number, paymentDetailsId: number) => {
  return await prisma.paymentDetails.findUnique({
    where: { id: paymentDetailsId },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          department: true,
          paidHolidays: {
            select: {
              remainingLeave: true,
            },
            where: {
              isValid: true,
            },
          },
        },
      },
      workDetails: true,
      earnings: true,
      deductions: true,
    },
  });
};

/**
 * Update remarks in payment details.
 * @param paymentDetailsId - The ID of the payment details
 * @param remarks - The remarks to be added
 * @returns The updated payment details
 */
export const updatePaymentDetailsRemarks = async (paymentDetailsId: number, remarks: string) => {
  return await prisma.paymentDetails.update({
    where: { id: paymentDetailsId },
    data: { remarks },
  });
};