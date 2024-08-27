-- CreateTable
CREATE TABLE "MonthlyRemuneration" (
    "id" SERIAL NOT NULL,
    "monthlySalary" INTEGER NOT NULL,
    "remunerationStartSalary" INTEGER NOT NULL,
    "remunerationEndSalary" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyRemuneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialInsuranceCalculation" (
    "id" SERIAL NOT NULL,
    "longTermInsurancePercentage" DOUBLE PRECISION NOT NULL,
    "healthInsurancePercentage" DOUBLE PRECISION NOT NULL,
    "employeePensionPercentage" DOUBLE PRECISION NOT NULL,
    "pensionStartSalary" INTEGER NOT NULL,
    "pensionEndSalary" INTEGER NOT NULL,
    "regularEmployeeInsurancePercentage" DOUBLE PRECISION NOT NULL,
    "specialEmployeeInsurancePercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialInsuranceCalculation_pkey" PRIMARY KEY ("id")
);
