import { NextResponse } from 'next/server'
import { generateSinglePdf } from '@/src/server/pdf/generate-pdfs'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const pdfBuffer = await generateSinglePdf('invoice-service.ejs', formData)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-Servico-${formData.invoiceNumber ?? 'documento'}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[generate-service-invoice] Erro:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar invoice de serviço' },
      { status: 500 }
    )
  }
}
