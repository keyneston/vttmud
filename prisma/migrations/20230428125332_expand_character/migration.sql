-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "ancestry" TEXT,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "heritage" TEXT;
