/*
  Warnings:

  - Changed the type of `month` on the `PaymentDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PaymentDetails" ADD COLUMN     "netSalary" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;
