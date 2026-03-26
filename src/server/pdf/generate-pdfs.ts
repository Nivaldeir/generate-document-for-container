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

const PUBLIC_DIR = path.join(process.cwd(), 'public')

function isDataUrl(str: string): boolean {
  return typeof str === 'string' && str.startsWith('data:')
}

function isHttpUrl(str: string): boolean {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'))
}

function getMimeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mime: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }
  return mime[ext] ?? 'image/png'
}

async function urlToDataUrl(url: string): Promise<string> {
  if (!url || isDataUrl(url)) return url
  if (isHttpUrl(url)) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) return url
      const buf = Buffer.from(await res.arrayBuffer())
      const contentType = res.headers.get('content-type') ?? 'image/png'
      return `data:${contentType};base64,${buf.toString('base64')}`
    } catch {
      return url
    }
  }
  const pathname = url.startsWith('/') ? url.slice(1) : url
  if (pathname.startsWith('upload/')) {
    try {
      const filePath = path.join(PUBLIC_DIR, pathname)
      const resolved = path.resolve(filePath)
      if (!resolved.startsWith(path.resolve(PUBLIC_DIR))) return url
      const buf = fs.readFileSync(resolved)
      const mime = getMimeFromPath(resolved)
      return `data:${mime};base64,${buf.toString('base64')}`
    } catch {
      return url
    }
  }
  return url
}

async function resolveImageUrls(formData: PdfFormData): Promise<PdfFormData> {
  const logoUrl = formData.logoUrl as string | undefined
  const signatureUrl = formData.signatureUrl as string | undefined
  const [resolvedLogo, resolvedSignature] = await Promise.all([
    logoUrl ? urlToDataUrl(logoUrl) : Promise.resolve(''),
    signatureUrl ? urlToDataUrl(signatureUrl) : Promise.resolve(''),
  ])
  return {
    ...formData,
    logoUrl: resolvedLogo || formData.logoUrl,
    signatureUrl: resolvedSignature || formData.signatureUrl,
  }
}

function templateData(formData: PdfFormData): PdfFormData & { blNumber: string } {
  const blNumbers = Array.isArray(formData.blNumbers) ? (formData.blNumbers as string[]) : []
  const blNumber = blNumbers.length ? blNumbers.join(', ') : String((formData as { blNumber?: string }).blNumber ?? '')
  return { ...formData, blNumber }
}

function resolveTemplatePath(baseTemplateName: string, groupRaw: unknown): string {
  const group = typeof groupRaw === 'string' ? groupRaw : 'default'
  const safeGroup = ['default', 'group-1', 'group-2', 'group-3'].includes(group) ? group : 'default'
  const groupedTemplateName =
    safeGroup === 'default'
      ? baseTemplateName
      : `${baseTemplateName.replace('.ejs', '')}.${safeGroup}.ejs`
  const groupedPath = path.join(TEMPLATES_DIR, groupedTemplateName)
  return fs.existsSync(groupedPath) ? groupedPath : path.join(TEMPLATES_DIR, baseTemplateName)
}

export async function generatePdfs(formData: PdfFormData): Promise<PdfGenerationResult> {
  const blTemplatePath = resolveTemplatePath('bl.ejs', formData.templateGroup)
  const paymentTemplatePath = resolveTemplatePath('payment.ejs', formData.templateGroup)
  const invoiceFreightTemplatePath = resolveTemplatePath('invoice.ejs', formData.templateGroup)
  const invoiceServiceTemplatePath = resolveTemplatePath('invoice-service.ejs', formData.templateGroup)
  const blTemplate = fs.readFileSync(blTemplatePath, 'utf-8')
  const paymentTemplate = fs.readFileSync(paymentTemplatePath, 'utf-8')
  const invoiceFreightTemplate = fs.readFileSync(invoiceFreightTemplatePath, 'utf-8')
  const invoiceServiceTemplate = fs.readFileSync(invoiceServiceTemplatePath, 'utf-8')

  const withImages = await resolveImageUrls(formData)
  const data = templateData(withImages)
  const blHtml = ejs.render(blTemplate, data, { filename: blTemplatePath })
  const paymentHtml = ejs.render(paymentTemplate, data, { filename: paymentTemplatePath })
  const isServiceInvoice = formData.invoiceType === 'service'
  const invoiceHtml = ejs.render(
    isServiceInvoice ? invoiceServiceTemplate : invoiceFreightTemplate,
    data,
    { filename: isServiceInvoice ? invoiceServiceTemplatePath : invoiceFreightTemplatePath }
  )

  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ?? process.env.CHROME_PATH ?? undefined
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
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
