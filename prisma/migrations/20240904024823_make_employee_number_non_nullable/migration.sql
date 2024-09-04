/*
  Warnings:

  - Made the column `employeeNumber` on table `PersonalInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PersonalInfo" ALTER COLUMN "employeeNumber" SET NOT NULL;
