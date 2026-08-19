import { NextResponse } from 'next/server'
import { generateSinglePdf } from '@/src/server/pdf/generate-pdfs'
import { prisma } from '@/src/shared/lib/prisma'

const TEMPLATE_MAP: Record<string, string> = {
  bl: 'bl.ejs',
  payment: 'payment.ejs',
  invoice: 'invoice.ejs',
  'invoice-service': 'invoice-service.ejs',
}

function resolveTemplateName(kind: string, invoiceType?: string): string | null {
  if (kind === 'invoice' && invoiceType === 'service') return TEMPLATE_MAP['invoice-service']
  return TEMPLATE_MAP[kind] ?? null
}

async function respondWithPdf(templateName: string, data: Record<string, unknown>, filename: string) {
  const pdfBuffer = await generateSinglePdf(templateName, data)
  return new Response(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()
    const templateName = TEMPLATE_MAP[type as string]
    if (!templateName) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }
    return await respondWithPdf(templateName, data, `${type}-${data?.invoiceNumber ?? 'doc'}.pdf`)
  } catch (error) {
    console.error('[download-pdf] Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Falha ao gerar PDF', details: String(error) }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const kind = searchParams.get('kind')
    if (!jobId || !kind) {
      return NextResponse.json({ error: 'jobId e kind são obrigatórios' }, { status: 400 })
    }
    const job = await prisma.pdfGenerationJob.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 })
    }
    const formData = JSON.parse(job.formData) as Record<string, unknown>
    const templateName = resolveTemplateName(kind, formData.invoiceType as string | undefined)
    if (!templateName) {
      return NextResponse.json({ error: 'Kind inválido' }, { status: 400 })
    }
    const invoiceNumber = String(formData.invoiceNumber ?? 'doc')
    return await respondWithPdf(templateName, formData, `${kind}-${invoiceNumber}.pdf`)
  } catch (error) {
    console.error('[download-pdf] Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Falha ao gerar PDF', details: String(error) }, { status: 500 })
  }
}
