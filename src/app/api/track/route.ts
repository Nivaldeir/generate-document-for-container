import { NextResponse } from 'next/server'

const TRACK_URL = 'http://skogc0k4gw84scg8c004wwgg.66.94.106.45.sslip.io/api/track'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as unknown))

    const code = typeof (body as any).code === 'string' ? (body as any).code.trim() : ''
    const carrier =
      typeof (body as any).carrier === 'string' && (body as any).carrier.trim() !== ''
        ? (body as any).carrier.trim()
        : 'msc'

    if (!code) {
      return NextResponse.json(
        { ok: false, error: 'Código obrigatório para rastreio.' },
        { status: 400 },
      )
    }

    const upstreamResponse = await fetch(TRACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, carrier }),
    })

    const data = await upstreamResponse.json().catch(() => null)

    return NextResponse.json(
      {
        ok: upstreamResponse.ok,
        status: upstreamResponse.status,
        data,
      },
      { status: upstreamResponse.ok ? 200 : upstreamResponse.status },
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao consultar rastreio.',
      },
      { status: 500 },
    )
  }
}

