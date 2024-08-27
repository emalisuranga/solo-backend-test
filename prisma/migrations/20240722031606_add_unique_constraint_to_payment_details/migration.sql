/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,month,year]` on the table `PaymentDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentDetails" ALTER COLUMN "netSalary" DROP DEFAULT,
ALTER COLUMN "totalDeductions" DROP DEFAULT,
ALTER COLUMN "totalEarnings" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetails_employeeId_month_year_key" ON "PaymentDetails"("employeeId", "month", "year");
