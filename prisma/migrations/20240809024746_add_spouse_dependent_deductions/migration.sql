-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "dependentDeduction" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spouseDeduction" INTEGER NOT NULL DEFAULT 0;
