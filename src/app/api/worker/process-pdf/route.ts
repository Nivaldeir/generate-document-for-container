import { NextResponse } from 'next/server'
import { processNextPdfJob } from '@/src/server/queue/pdf-generation.queue'

export async function POST() {
  try {
    const { processed, jobId, error } = await processNextPdfJob()
    return NextResponse.json({ processed, jobId, error: error ?? undefined })
  } catch (err) {
    console.error('[worker/process-pdf] Erro:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao processar fila' },
      { status: 500 }
    )
  }
}
