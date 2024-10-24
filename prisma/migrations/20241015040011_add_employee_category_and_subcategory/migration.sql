/*
  Warnings:

  - The values [EXECUTIVE,NON_EXECUTIVE] on the enum `EmployeeCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmployeeSubcategory" AS ENUM ('NON_EXECUTIVE', 'EXECUTIVE');

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeCategory_new" AS ENUM ('MONTHLY_BASIC', 'DAILY_BASIC', 'HOURLY_BASIC');
ALTER TABLE "PersonalInfo" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "PersonalInfo" ALTER COLUMN "category" TYPE "EmployeeCategory_new" USING ("category"::text::"EmployeeCategory_new");
ALTER TYPE "EmployeeCategory" RENAME TO "EmployeeCategory_old";
ALTER TYPE "EmployeeCategory_new" RENAME TO "EmployeeCategory";
DROP TYPE "EmployeeCategory_old";
ALTER TABLE "PersonalInfo" ALTER COLUMN "category" SET DEFAULT 'MONTHLY_BASIC';
COMMIT;

-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "subcategory" "EmployeeSubcategory",
ALTER COLUMN "category" SET DEFAULT 'MONTHLY_BASIC';
