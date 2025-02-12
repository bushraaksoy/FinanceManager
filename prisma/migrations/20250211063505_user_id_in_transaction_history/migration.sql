/*
  Warnings:

  - Added the required column `userId` to the `ExpenseHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SavingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseHistory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SavingHistory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SavingHistory" ADD CONSTRAINT "SavingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseHistory" ADD CONSTRAINT "ExpenseHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
