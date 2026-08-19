import { prisma } from '@/src/shared/lib/prisma'
import { generatePdfs, type PdfFormData } from '../pdf/generate-pdfs'

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
  return {
    id: job.id,
    status: job.status as JobStatus,
    batchId: job.batchId,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  }
}

export async function generatePdfsForJob(jobId: string): Promise<PdfJobResult> {
  const job = await prisma.pdfGenerationJob.findUnique({ where: { id: jobId } })
  if (!job) throw new Error('Job não encontrado')
  const formData = JSON.parse(job.formData) as PdfFormData
  const generated = await generatePdfs(formData)
  return {
    pdfUrls: {
      bl: `data:application/pdf;base64,${generated.bl}`,
      payment: `data:application/pdf;base64,${generated.payment}`,
      invoice: `data:application/pdf;base64,${generated.invoice}`,
    },
    batchId: job.batchId ?? undefined,
  }
}

export async function processNextPdfJob(): Promise<{ processed: boolean; jobId?: string; error?: string }> {
  const job = await prisma.pdfGenerationJob.findFirst({
    where: { status: JOB_STATUS.PENDING },
    orderBy: { createdAt: 'asc' },
  })
  if (!job) return { processed: false }

  const batchId = job.batchId ?? generateBatchId()
  await prisma.pdfGenerationJob.update({
    where: { id: job.id },
    data: {
      status: JOB_STATUS.COMPLETED,
      batchId,
      completedAt: new Date(),
    },
  })
  return { processed: true, jobId: job.id }
}
