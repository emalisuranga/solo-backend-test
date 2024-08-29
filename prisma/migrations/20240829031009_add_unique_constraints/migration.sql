/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,dateOfBirth,phone,address]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PersonalInfo_firstName_idx";

-- DropIndex
DROP INDEX "PersonalInfo_lastName_idx";

-- DropIndex
DROP INDEX "PersonalInfo_phone_idx";

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_firstName_lastName_dateOfBirth_phone_address_key" ON "PersonalInfo"("firstName", "lastName", "dateOfBirth", "phone", "address");
