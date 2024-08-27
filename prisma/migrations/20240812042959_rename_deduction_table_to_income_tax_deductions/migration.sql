-- CreateTable
CREATE TABLE "IncomeTaxDeduction" (
    "id" SERIAL NOT NULL,
    "spouseDeduction" INTEGER NOT NULL,
    "dependentDeduction" INTEGER NOT NULL,
    "basicDeduction" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeTaxDeduction_pkey" PRIMARY KEY ("id")
);
