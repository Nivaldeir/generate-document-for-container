import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const ALLOWED_TYPES = ['logo', 'signature'] as const
const UPLOAD_DIR = join(process.cwd(), 'public', 'upload')
const ASSET_NAMES = { logo: 'logo', signature: 'signature' } as const

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  }
  return map[mime] ?? '.png'
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const type = formData.get('type') as (typeof ALLOWED_TYPES)[number] | null
    const file = formData.get('file') as File | null

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'type deve ser logo ou signature' }, { status: 400 })
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = getExtension(file.type)
    const filename = `${ASSET_NAMES[type]}${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(filepath, buffer)

    const url = `/upload/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[api/upload-asset] POST', error)
    return NextResponse.json({ error: 'Erro ao enviar arquivo' }, { status: 500 })
  }
}
