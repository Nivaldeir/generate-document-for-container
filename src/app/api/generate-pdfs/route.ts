import { NextResponse } from 'next/server'
import { enqueuePdfJob } from '@/src/server/queue/pdf-generation.queue'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const { jobId } = await enqueuePdfJob(formData)
    return NextResponse.json({ success: true, jobId })
  } catch (error) {
    console.error('[generate-pdfs] Erro ao enfileirar:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao enfileirar geração de PDFs',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
