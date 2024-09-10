/*
  Warnings:

  - A unique constraint covering the columns `[employeeNumber]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firstName,lastName,phone,address,isDeleted]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PersonalInfo_employeeNumber_firstName_lastName_phone_addres_key";

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_employeeNumber_key" ON "PersonalInfo"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_firstName_lastName_phone_address_isDeleted_key" ON "PersonalInfo"("firstName", "lastName", "phone", "address", "isDeleted");
