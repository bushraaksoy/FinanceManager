/*
  Warnings:

  - You are about to drop the column `card_id` on the `Income` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_card_id_fkey";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "card_id",
ADD COLUMN     "cardId" INTEGER;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
