/*
  Warnings:

  - A unique constraint covering the columns `[employeeNumber]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeNumber,firstName,lastName,dateOfBirth,phone,address]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PersonalInfo_firstName_lastName_dateOfBirth_phone_address_key";

-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "employeeNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_employeeNumber_key" ON "PersonalInfo"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_employeeNumber_firstName_lastName_dateOfBirth__key" ON "PersonalInfo"("employeeNumber", "firstName", "lastName", "dateOfBirth", "phone", "address");
