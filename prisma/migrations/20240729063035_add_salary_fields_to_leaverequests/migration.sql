/*
  Warnings:

  - Added the required column `salaryMonth` to the `LeaveRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryYear` to the `LeaveRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaveRequests" ADD COLUMN     "salaryMonth" INTEGER NOT NULL,
ADD COLUMN     "salaryYear" INTEGER NOT NULL;
