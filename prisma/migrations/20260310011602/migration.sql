/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PdfGenerationJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "PdfGenerationJob";

-- CreateTable
CREATE TABLE "pdf_generation_jobs" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "batchId" TEXT,
    "formData" TEXT NOT NULL,
    "result" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "pdf_generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "beneficiaryBank" TEXT,
    "bankCode" TEXT,
    "branchCode" TEXT,
    "swiftCode" TEXT,
    "swiftBic" TEXT,
    "intermediaryBank" TEXT,
    "accountNumber" TEXT,
    "routingNumber" TEXT,
    "beneficiaryAddress" TEXT,
    "logoUrl" TEXT,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);
