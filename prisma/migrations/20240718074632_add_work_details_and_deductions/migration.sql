-- CreateTable
CREATE TABLE "WorkDetails" (
    "id" SERIAL NOT NULL,
    "scheduledWorkingDays" INTEGER NOT NULL,
    "numberOfWorkingDays" INTEGER NOT NULL,
    "numberOfPaidHolidays" INTEGER NOT NULL,
    "remainingPaidVacationDays" INTEGER NOT NULL,
    "overtime" INTEGER NOT NULL,
    "timeLate" INTEGER NOT NULL,
    "timeLeavingEarly" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "WorkDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deductions" (
    "id" SERIAL NOT NULL,
    "healthInsurance" DOUBLE PRECISION NOT NULL,
    "employeePensionInsurance" DOUBLE PRECISION NOT NULL,
    "employmentInsurance" DOUBLE PRECISION NOT NULL,
    "longTermCareInsurance" DOUBLE PRECISION NOT NULL,
    "socialInsurance" DOUBLE PRECISION NOT NULL,
    "incomeTax" DOUBLE PRECISION NOT NULL,
    "residentTax" DOUBLE PRECISION NOT NULL,
    "advancePayment" DOUBLE PRECISION NOT NULL,
    "yearEndAdjustment" DOUBLE PRECISION NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Deductions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkDetails_employeeId_key" ON "WorkDetails"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Deductions_employeeId_key" ON "Deductions"("employeeId");

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deductions" ADD CONSTRAINT "Deductions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "PersonalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
