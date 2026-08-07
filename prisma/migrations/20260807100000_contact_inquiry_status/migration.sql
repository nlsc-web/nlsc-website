-- CreateEnum
CREATE TYPE "ContactInquiryStatus" AS ENUM ('unread', 'read');

-- AlterTable
ALTER TABLE "ContactInquiry" ADD COLUMN "status" "ContactInquiryStatus" NOT NULL DEFAULT 'unread';

-- CreateIndex
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");