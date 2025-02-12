/*
  Warnings:

  - The values [TRANSPORTATION,CLOTHING] on the enum `ExpenseCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `durationPeriod` on the `Saving` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FIXED', 'FLEXIBLE');

-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseCategory_new" AS ENUM ('HOUSING', 'TRANSPORT', 'HEALTH', 'GROCERIES', 'SHOPPING', 'INSURANCE', 'ENTERTAINMENT', 'OTHER');
ALTER TABLE "Expense" ALTER COLUMN "category" TYPE "ExpenseCategory_new" USING ("category"::text::"ExpenseCategory_new");
ALTER TYPE "ExpenseCategory" RENAME TO "ExpenseCategory_old";
ALTER TYPE "ExpenseCategory_new" RENAME TO "ExpenseCategory";
DROP TYPE "ExpenseCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "Saving" DROP COLUMN "durationPeriod",
ADD COLUMN     "monthlySavingAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "SavingHistory" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "savingId" INTEGER NOT NULL,

    CONSTRAINT "SavingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingHistory" ADD CONSTRAINT "SavingHistory_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
