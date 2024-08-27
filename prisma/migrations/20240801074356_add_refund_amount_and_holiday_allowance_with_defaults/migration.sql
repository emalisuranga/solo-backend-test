-- AlterTable
ALTER TABLE "Deductions" ADD COLUMN     "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Earnings" ADD COLUMN     "holidayAllowance" DOUBLE PRECISION NOT NULL DEFAULT 0;
