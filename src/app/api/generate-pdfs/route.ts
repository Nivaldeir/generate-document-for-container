import { NextResponse } from 'next/server'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    // Caminhos dos templates
    const templatesDir = path.join(process.cwd(), 'templates')
    const blTemplate = fs.readFileSync(path.join(templatesDir, 'bl.ejs'), 'utf-8')
    const paymentTemplate = fs.readFileSync(path.join(templatesDir, 'payment.ejs'), 'utf-8')
    const invoiceTemplate = fs.readFileSync(path.join(templatesDir, 'invoice.ejs'), 'utf-8')

    // Renderizar os templates com EJS
    const blHtml = ejs.render(blTemplate, formData)
    const paymentHtml = ejs.render(paymentTemplate, formData)
    const invoiceHtml = ejs.render(invoiceTemplate, formData)

    // Inicializar o Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    // Gerar PDF do BL
    const blPage = await browser.newPage()
    await blPage.setContent(blHtml, { waitUntil: 'networkidle0' })
    const blPdf = await blPage.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    })
    await blPage.close()

    // Gerar PDF do Pagamento
    const paymentPage = await browser.newPage()
    await paymentPage.setContent(paymentHtml, { waitUntil: 'networkidle0' })
    const paymentPdf = await paymentPage.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    })
    await paymentPage.close()

    // Gerar PDF da Invoice
    const invoicePage = await browser.newPage()
    await invoicePage.setContent(invoiceHtml, { waitUntil: 'networkidle0' })
    const invoicePdf = await invoicePage.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    })
    await invoicePage.close()

    await browser.close()

    // Converter para Base64
    const blBase64 = Buffer.from(blPdf).toString('base64')
    const paymentBase64 = Buffer.from(paymentPdf).toString('base64')
    const invoiceBase64 = Buffer.from(invoicePdf).toString('base64')

    return NextResponse.json({
      success: true,
      pdfUrls: {
        bl: `data:application/pdf;base64,${blBase64}`,
        payment: `data:application/pdf;base64,${paymentBase64}`,
        invoice: `data:application/pdf;base64,${invoiceBase64}`
      }
    })
  } catch (error) {
    console.error('[v0] Error generating PDFs:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao gerar PDFs',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
