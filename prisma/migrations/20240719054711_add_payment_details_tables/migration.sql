/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Deductions` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `WorkDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentDetailsId]` on the table `Deductions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentDetailsId]` on the table `WorkDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentDetailsId` to the `Deductions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDetailsId` to the `WorkDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deductions" DROP CONSTRAINT "Deductions_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "WorkDetails" DROP CONSTRAINT "WorkDetails_employeeId_fkey";

-- DropIndex
DROP INDEX "Deductions_employeeId_key";

-- DropIndex
DROP INDEX "WorkDetails_employeeId_key";

-- AlterTable
ALTER TABLE "Deductions" DROP COLUMN "employeeId",
ADD COLUMN     "paymentDetailsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkDetails" DROP COLUMN "employeeId",
ADD COLUMN     "paymentDetailsId" INTEGER NOT NULL,
ALTER COLUMN "overtime" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "timeLate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "timeLeavingEarly" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "PaymentDetails" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earnings" (
    "id" SERIAL NOT NULL,
    "paymentDetailsId" INTEGER NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "overtimePay" DOUBLE PRECISION NOT NULL,
    "transportationCosts" DOUBLE PRECISION NOT NULL,
    "attendanceAllowance" DOUBLE PRECISION NOT NULL,
    "familyAllowance" DOUBLE PRECISION NOT NULL,
    "leaveAllowance" DOUBLE PRECISION NOT NULL,
    "specialAllowance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Earnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Earnings_paymentDetailsId_key" ON "Earnings"("paymentDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Deductions_paymentDetailsId_key" ON "Deductions"("paymentDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkDetails_paymentDetailsId_key" ON "WorkDetails"("paymentDetailsId");

-- AddForeignKey
ALTER TABLE "PaymentDetails" ADD CONSTRAINT "PaymentDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_paymentDetailsId_fkey" FOREIGN KEY ("paymentDetailsId") REFERENCES "PaymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earnings" ADD CONSTRAINT "Earnings_paymentDetailsId_fkey" FOREIGN KEY ("paymentDetailsId") REFERENCES "PaymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deductions" ADD CONSTRAINT "Deductions_paymentDetailsId_fkey" FOREIGN KEY ("paymentDetailsId") REFERENCES "PaymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
