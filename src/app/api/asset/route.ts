import { NextResponse } from 'next/server'
import { MinioS3 } from '@/src/shared/lib/minio'

const EXT_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

function inferContentType(objectName: string): string {
  const dot = objectName.lastIndexOf('.')
  if (dot < 0) return 'application/octet-stream'
  const ext = objectName.slice(dot).toLowerCase()
  return EXT_MIME[ext] ?? 'application/octet-stream'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  if (!key) {
    return NextResponse.json({ error: 'key obrigatório' }, { status: 400 })
  }

  try {
    const stat = await MinioS3.statObject(key).catch(() => null)
    const contentType = stat?.metaData?.['content-type'] ?? inferContentType(key)
    const stream = await MinioS3.getObject(key)
    return new NextResponse(stream as unknown as ReadableStream<Uint8Array>, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[api/asset] GET', error)
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }
}
