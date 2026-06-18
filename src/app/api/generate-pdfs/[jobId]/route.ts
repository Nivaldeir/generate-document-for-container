import { NextResponse } from 'next/server'
import { getPdfJob } from '@/src/server/queue/pdf-generation.queue'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const job = await getPdfJob(jobId)
    if (!job) {
      return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 })
    }
    return NextResponse.json({
      id: job.id,
      status: job.status,
      result: job.result ?? undefined,
      error: job.error ?? undefined,
      createdAt: job.createdAt,
      completedAt: job.completedAt ?? undefined,
    })
  } catch (error) {
    console.error('[generate-pdfs] Erro ao buscar job:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar status do job' },
      { status: 500 }
    )
  }
}
