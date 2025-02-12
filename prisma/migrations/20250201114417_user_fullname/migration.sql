-- AlterEnum
ALTER TYPE "Frequency" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "fullname" TEXT;

-- DropEnum
DROP TYPE "ExpenseType";
