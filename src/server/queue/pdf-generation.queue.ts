import { prisma } from '@/src/shared/lib/prisma'
import { MinioS3 } from '@/src/shared/lib/minio'
import { generatePdfs, type PdfFormData } from '../pdf/generate-pdfs'

const MIME_PDF = 'application/pdf'

export const JOB_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS]

export type PdfJobResult = {
  pdfUrls: {
    bl: string
    payment: string
    invoice: string
  }
  batchId?: string
}

function generateBatchId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function enqueuePdfJob(formData: PdfFormData): Promise<{ jobId: string }> {
  const job = await prisma.pdfGenerationJob.create({
    data: {
      status: JOB_STATUS.PENDING,
      formData: JSON.stringify(formData),
    },
  })
  return { jobId: job.id }
}

export async function getPdfJob(jobId: string) {
  const job = await prisma.pdfGenerationJob.findUnique({
    where: { id: jobId },
  })
  if (!job) return null
  const result = job.result ? (JSON.parse(job.result) as PdfJobResult) : null
  return {
    id: job.id,
    status: job.status as JobStatus,
    result,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  }
}

export async function processNextPdfJob(): Promise<{ processed: boolean; jobId?: string; error?: string }> {
  const job = await prisma.pdfGenerationJob.findFirst({
    where: { status: JOB_STATUS.PENDING },
    orderBy: { createdAt: 'asc' },
  })
  if (!job) return { processed: false }

  await prisma.pdfGenerationJob.update({
    where: { id: job.id },
    data: { status: JOB_STATUS.PROCESSING },
  })

  try {
    const formData = JSON.parse(job.formData) as PdfFormData
    const generated = await generatePdfs(formData)
    const batchId = job.batchId ?? generateBatchId()
    const invoiceNumber = String(formData.invoiceNumber ?? '')
    const blLabel = Array.isArray(formData.blNumbers) && (formData.blNumbers as string[]).length
      ? (formData.blNumbers as string[]).join('-')
      : 'BL'

    const blBuffer = Buffer.from(generated.bl, 'base64')
    const paymentBuffer = Buffer.from(generated.payment, 'base64')
    const invoiceBuffer = Buffer.from(generated.invoice, 'base64')

    const blUpload = await MinioS3.uploadWithUniqueName({
      fileName: `BL-${blLabel}.pdf`,
      buffer: blBuffer,
      contentType: MIME_PDF,
      prefix: 'documentos',
    })
    const paymentUpload = await MinioS3.uploadWithUniqueName({
      fileName: `Pagamento-Frete-${invoiceNumber}.pdf`,
      buffer: paymentBuffer,
      contentType: MIME_PDF,
      prefix: 'documentos',
    })
    const invoiceUpload = await MinioS3.uploadWithUniqueName({
      fileName: `Invoice-${invoiceNumber}.pdf`,
      buffer: invoiceBuffer,
      contentType: MIME_PDF,
      prefix: 'documentos',
    })

    await prisma.uploadedFile.createMany({
      data: [
        { filename: blUpload.objectName, originalName: `BL-${blLabel}.pdf`, mimeType: MIME_PDF, sizeInBytes: blBuffer.length, batchId, kind: 'bl' },
        { filename: paymentUpload.objectName, originalName: `Pagamento-Frete-${invoiceNumber}.pdf`, mimeType: MIME_PDF, sizeInBytes: paymentBuffer.length, batchId, kind: 'payment' },
        { filename: invoiceUpload.objectName, originalName: `Invoice-${invoiceNumber}.pdf`, mimeType: MIME_PDF, sizeInBytes: invoiceBuffer.length, batchId, kind: 'invoice' },
      ],
    })

    const result: PdfJobResult = {
      pdfUrls: {
        bl: `data:application/pdf;base64,${generated.bl}`,
        payment: `data:application/pdf;base64,${generated.payment}`,
        invoice: `data:application/pdf;base64,${generated.invoice}`,
      },
      batchId,
    }
    await prisma.pdfGenerationJob.update({
      where: { id: job.id },
      data: {
        status: JOB_STATUS.COMPLETED,
        result: JSON.stringify(result),
        completedAt: new Date(),
      },
    })
    return { processed: true, jobId: job.id }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    await prisma.pdfGenerationJob.update({
      where: { id: job.id },
      data: {
        status: JOB_STATUS.FAILED,
        error: errorMessage,
        completedAt: new Date(),
      },
    })
    return { processed: true, jobId: job.id, error: errorMessage }
  }
}
