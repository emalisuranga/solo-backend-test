-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "performedBy" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "WorkDetails" ADD COLUMN     "numberOfHolidayAllowanceDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfNonPoaidLeave" INTEGER NOT NULL DEFAULT 0;
