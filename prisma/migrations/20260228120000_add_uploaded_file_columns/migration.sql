-- AlterTable
ALTER TABLE "UploadedFile" ADD COLUMN "batchId" TEXT;
ALTER TABLE "UploadedFile" ADD COLUMN "containerCount" INTEGER;
ALTER TABLE "UploadedFile" ADD COLUMN "kind" TEXT;
