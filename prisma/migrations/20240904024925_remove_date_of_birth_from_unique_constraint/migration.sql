/*
  Warnings:

  - A unique constraint covering the columns `[employeeNumber,firstName,lastName,phone,address]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PersonalInfo_employeeNumber_firstName_lastName_dateOfBirth__key";

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_employeeNumber_firstName_lastName_phone_addres_key" ON "PersonalInfo"("employeeNumber", "firstName", "lastName", "phone", "address");
