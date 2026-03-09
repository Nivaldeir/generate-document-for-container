import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'shared', 'templates')

export type PdfFormData = Record<string, unknown>

export type PdfGenerationResult = {
  bl: string
  payment: string
  invoice: string
}

function templateData(formData: PdfFormData): PdfFormData & { blNumber: string } {
  const blNumbers = Array.isArray(formData.blNumbers) ? (formData.blNumbers as string[]) : []
  const blNumber = blNumbers.length ? blNumbers.join(', ') : String((formData as { blNumber?: string }).blNumber ?? '')
  return { ...formData, blNumber }
}

export async function generatePdfs(formData: PdfFormData): Promise<PdfGenerationResult> {
  const blTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'bl.ejs'), 'utf-8')
  const paymentTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'payment.ejs'), 'utf-8')
  const invoiceFreightTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'invoice.ejs'), 'utf-8')
  const invoiceServiceTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'invoice-service.ejs'), 'utf-8')

  const data = templateData(formData)
  const blHtml = ejs.render(blTemplate, data)
  const paymentHtml = ejs.render(paymentTemplate, data)
  const isServiceInvoice = formData.invoiceType === 'service'
  const invoiceHtml = ejs.render(isServiceInvoice ? invoiceServiceTemplate : invoiceFreightTemplate, data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const pdfOptions = {
    format: 'A4' as const,
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  }

  try {
    const blPage = await browser.newPage()
    await blPage.setContent(blHtml, { waitUntil: 'networkidle0' })
    const blPdf = await blPage.pdf(pdfOptions)
    await blPage.close()

    const paymentPage = await browser.newPage()
    await paymentPage.setContent(paymentHtml, { waitUntil: 'networkidle0' })
    const paymentPdf = await paymentPage.pdf(pdfOptions)
    await paymentPage.close()

    const invoicePage = await browser.newPage()
    await invoicePage.setContent(invoiceHtml, { waitUntil: 'networkidle0' })
    const invoicePdf = await invoicePage.pdf(pdfOptions)
    await invoicePage.close()

    return {
      bl: Buffer.from(blPdf).toString('base64'),
      payment: Buffer.from(paymentPdf).toString('base64'),
      invoice: Buffer.from(invoicePdf).toString('base64'),
    }
  } finally {
    await browser.close()
  }
}
