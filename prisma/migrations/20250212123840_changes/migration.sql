/*
  Warnings:

  - You are about to drop the `ExpenseHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExpenseHistory" DROP CONSTRAINT "ExpenseHistory_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "ExpenseHistory" DROP CONSTRAINT "ExpenseHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavingHistory" DROP CONSTRAINT "SavingHistory_savingId_fkey";

-- DropForeignKey
ALTER TABLE "SavingHistory" DROP CONSTRAINT "SavingHistory_userId_fkey";

-- DropTable
DROP TABLE "ExpenseHistory";

-- DropTable
DROP TABLE "SavingHistory";
