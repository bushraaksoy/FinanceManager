-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageType" TEXT;

-- AlterTable
ALTER TABLE "Saving" ALTER COLUMN "savedAmount" SET DEFAULT 0;
