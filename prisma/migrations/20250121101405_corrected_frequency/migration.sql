/*
  Warnings:

  - You are about to drop the column `freqency` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `freqency` on the `Income` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REMINDER', 'ALERT');

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "freqency",
ADD COLUMN     "frequency" "Frequency";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "freqency",
ADD COLUMN     "frequency" "Frequency";
