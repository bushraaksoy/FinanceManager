/*
  Warnings:

  - Made the column `incomeId` on table `TransactionHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_incomeId_fkey";

-- AlterTable
ALTER TABLE "TransactionHistory" ALTER COLUMN "incomeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "Income"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
