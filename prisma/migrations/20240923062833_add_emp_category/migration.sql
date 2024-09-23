-- CreateEnum
CREATE TYPE "EmployeeCategory" AS ENUM ('EXECUTIVE', 'NON_EXECUTIVE');

-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "category" "EmployeeCategory" NOT NULL DEFAULT 'NON_EXECUTIVE';
