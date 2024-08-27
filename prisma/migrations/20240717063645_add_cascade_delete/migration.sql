-- DropForeignKey
ALTER TABLE "BankDetails" DROP CONSTRAINT "BankDetails_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "SalaryDetails" DROP CONSTRAINT "SalaryDetails_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryDetails" ADD CONSTRAINT "SalaryDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
