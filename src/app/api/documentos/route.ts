import { NextResponse } from 'next/server'
import { prisma } from '@/src/shared/lib/prisma'
import { MinioS3 } from '@/src/shared/lib/minio'

const MIME_PDF = 'application/pdf'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Content-Type deve ser multipart/form-data' },
      { status: 400 }
    )
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const originalName = (formData.get('originalName') as string) || 'documento.pdf'
    const batchId = (formData.get('batchId') as string) || null
    const kind = (formData.get('kind') as string) || null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Arquivo não enviado' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { objectName, url } = await MinioS3.uploadWithUniqueName({
      fileName: originalName,
      buffer,
      contentType: MIME_PDF,
      prefix: 'documentos',
    })

    const record = await prisma.uploadedFile.create({
      data: {
        filename: objectName,
        originalName: originalName || objectName,
        mimeType: MIME_PDF,
        sizeInBytes: buffer.length,
        batchId,
        kind,
      },
    })

    return NextResponse.json({
      id: record.id,
      filename: record.filename,
      originalName: record.originalName,
      url: url || `/api/documentos/download?filename=${encodeURIComponent(record.filename)}`,
    })
  } catch (error) {
    console.error('[api/documentos] POST', error)
    const isFormDataParseError =
      error instanceof TypeError &&
      (error.message.includes('Failed to parse body as FormData') ||
        error.message.includes('parse body'))
    if (isFormDataParseError) {
      return NextResponse.json(
        {
          error: 'Corpo da requisição inválido ou muito grande. Tente um PDF menor ou aumente o limite no servidor.',
        },
        { status: 413 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao salvar documento' },
      { status: 500 }
    )
  }
}
