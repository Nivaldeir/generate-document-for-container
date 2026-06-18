import { NextResponse } from 'next/server'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import { Readable } from 'stream'
import { MinioS3 } from '@/src/shared/lib/minio'

const UPLOAD_DIR = join(process.cwd(), 'public', 'upload')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  if (!filename) {
    return NextResponse.json({ error: 'filename obrigatório' }, { status: 400 })
  }

  const headers = {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="${filename.split('/').pop() ?? 'documento.pdf'}"`,
  }

  try {
    const stream = await MinioS3.getObject(filename)
    return new NextResponse(stream as unknown as ReadableStream<Uint8Array>, { headers })
  } catch {
    const localPath = join(UPLOAD_DIR, filename)
    if (existsSync(localPath)) {
      const nodeStream = createReadStream(localPath)
      const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>
      return new NextResponse(webStream, { headers })
    }
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }
}
