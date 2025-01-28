/*
  Warnings:

  - The `durationPeriod` column on the `Saving` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Saving" DROP COLUMN "durationPeriod",
ADD COLUMN     "durationPeriod" INTEGER;
