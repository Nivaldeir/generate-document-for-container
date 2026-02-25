import { NextResponse } from 'next/server'
import ejs from 'ejs'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    console.log('[v0] API: Recebendo requisição de PDF')
    const { type, data } = await request.json()
    console.log('[v0] API: Tipo de PDF:', type)

    let templatePath = ''

    const templatesDir = join(process.cwd(), 'src', 'shared', 'templates')
    switch (type) {
      case 'bl':
        templatePath = join(templatesDir, 'bl.ejs')
        break
      case 'payment':
        templatePath = join(templatesDir, 'payment.ejs')
        break
      case 'invoice':
        templatePath = join(templatesDir, 'invoice.ejs')
        break
      default:
        console.log('[v0] API: Tipo inválido')
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    console.log('[v0] API: Lendo template de', templatePath)
    const template = readFileSync(templatePath, 'utf-8')
    const html = ejs.render(template, data)
    console.log('[v0] API: HTML renderizado, tamanho:', html.length)

    // Retornar HTML para o cliente converter em PDF
    return NextResponse.json({ html })
  } catch (error) {
    console.error('[v0] API: Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF', details: String(error) }, { status: 500 })
  }
}
