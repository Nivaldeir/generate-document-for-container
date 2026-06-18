import { NextResponse } from 'next/server'
import { generateSinglePdf } from '@/src/server/pdf/generate-pdfs'

const TEMPLATE_MAP: Record<string, string> = {
  bl: 'bl.ejs',
  payment: 'payment.ejs',
  invoice: 'invoice.ejs',
  'invoice-service': 'invoice-service.ejs',
}

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    const templateName = TEMPLATE_MAP[type as string]
    if (!templateName) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    const pdfBuffer = await generateSinglePdf(templateName, data)

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}-${data?.invoiceNumber ?? 'doc'}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[download-pdf] Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Falha ao gerar PDF', details: String(error) },
      { status: 500 },
    )
  }
}
