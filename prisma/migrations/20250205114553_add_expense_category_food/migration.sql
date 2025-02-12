/*
  Warnings:

  - You are about to drop the column `date` on the `SavingHistory` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FinancialLiteracy" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterEnum
ALTER TYPE "ExpenseCategory" ADD VALUE 'FOOD';

-- AlterTable
ALTER TABLE "SavingHistory" DROP COLUMN "date";

-- CreateTable
CREATE TABLE "ExpenseHistory" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expenseId" INTEGER NOT NULL,

    CONSTRAINT "ExpenseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyData" (
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "monthlyIncome" DOUBLE PRECISION,
    "financialLiteracy" "FinancialLiteracy",
    "maxSpending" "ExpenseCategory",
    "avgMonthlySpending" DOUBLE PRECISION,
    "financialGoalPriority" TEXT,
    "importantAppFeature" TEXT,

    CONSTRAINT "SurveyData_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "ExpenseHistory" ADD CONSTRAINT "ExpenseHistory_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
