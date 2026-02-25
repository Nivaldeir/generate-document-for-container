import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { prisma } from '@/src/shared/lib/prisma'

const UPLOAD_DIR = join(process.cwd(), 'public', 'upload')
const MIME_PDF = 'application/pdf'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const originalName = (formData.get('originalName') as string) || 'documento.pdf'

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Arquivo não enviado' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${randomUUID()}.pdf`
    const filepath = join(UPLOAD_DIR, filename)

    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(filepath, buffer)

    const record = await prisma.uploadedFile.create({
      data: {
        filename,
        originalName: originalName || filename,
        mimeType: MIME_PDF,
        sizeInBytes: buffer.length,
      },
    })

    return NextResponse.json({
      id: record.id,
      filename: record.filename,
      originalName: record.originalName,
      url: `/upload/${record.filename}`,
    })
  } catch (error) {
    console.error('[api/documentos] POST', error)
    return NextResponse.json(
      { error: 'Erro ao salvar documento' },
      { status: 500 }
    )
  }
}
