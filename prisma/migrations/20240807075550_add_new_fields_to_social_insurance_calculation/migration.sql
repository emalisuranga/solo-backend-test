-- AlterTable
ALTER TABLE "SocialInsuranceCalculation" ADD COLUMN     "pensionEndMonthlySalary" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pensionStartMonthlySalary" INTEGER NOT NULL DEFAULT 0;
