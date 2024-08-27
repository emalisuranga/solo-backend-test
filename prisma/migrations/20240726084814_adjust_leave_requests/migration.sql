-- CreateTable
CREATE TABLE "PaidHolidays" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "totalLeave" INTEGER NOT NULL,
    "usedLeave" INTEGER NOT NULL,
    "remainingLeave" INTEGER NOT NULL,
    "leaveStart" TIMESTAMP(3) NOT NULL,
    "leaveEnd" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PaidHolidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequests" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "initialDays" INTEGER NOT NULL,
    "adjustedDays" INTEGER NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaidHolidays" ADD CONSTRAINT "PaidHolidays_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequests" ADD CONSTRAINT "LeaveRequests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
