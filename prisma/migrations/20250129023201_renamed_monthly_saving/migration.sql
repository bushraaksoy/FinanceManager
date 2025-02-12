/*
  Warnings:

  - You are about to drop the column `monthlySavingAmount` on the `Saving` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Saving" DROP COLUMN "monthlySavingAmount",
ADD COLUMN     "monthlySaving" DOUBLE PRECISION;
