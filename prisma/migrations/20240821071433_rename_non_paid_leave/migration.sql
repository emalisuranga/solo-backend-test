/*
  Warnings:

  - You are about to drop the column `numberOfNonPoaidLeave` on the `WorkDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkDetails" DROP COLUMN "numberOfNonPoaidLeave",
ADD COLUMN     "numberOfNonPaidLeave" INTEGER NOT NULL DEFAULT 0;
