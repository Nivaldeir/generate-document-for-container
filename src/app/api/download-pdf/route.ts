import { NextResponse } from 'next/server'
import ejs from 'ejs'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

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
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const template = readFileSync(templatePath, 'utf-8')
    const html = ejs.render(template, data)

    // Retornar HTML para o cliente converter em PDF
    return NextResponse.json({ html })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF', details: String(error) }, { status: 500 })
  }
}
