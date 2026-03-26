import { NextResponse } from 'next/server'
import ejs from 'ejs'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    const templatesDir = join(process.cwd(), 'src', 'shared', 'templates')
    const baseTemplates: Record<string, string> = {
      bl: 'bl.ejs',
      payment: 'payment.ejs',
      invoice: 'invoice.ejs',
      'invoice-service': 'invoice-service.ejs',
    }

    const baseTemplateName = baseTemplates[type as string]
    if (!baseTemplateName) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const rawGroup = String(data?.templateGroup ?? 'default')
    const validGroup = ['default', 'group-1', 'group-2', 'group-3'].includes(rawGroup)
      ? rawGroup
      : 'default'
    const groupedTemplateName =
      validGroup === 'default'
        ? baseTemplateName
        : `${baseTemplateName.replace('.ejs', '')}.${validGroup}.ejs`

    const groupedPath = join(templatesDir, groupedTemplateName)
    const templatePath = existsSync(groupedPath)
      ? groupedPath
      : join(templatesDir, baseTemplateName)

    const template = readFileSync(templatePath, 'utf-8')
    const html = ejs.render(template, data, { filename: templatePath })

    // Retornar HTML para o cliente converter em PDF
    return NextResponse.json({ html })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF', details: String(error) }, { status: 500 })
  }
}
