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

const OPTIONAL_STRING_FIELDS = [
  'beneficiaryBank', 'beneficiaryAddress', 'bankCode', 'branchCode',
  'swiftCode', 'swiftBic', 'intermediaryBank', 'routingNumber',
  'issueDate', 'paymentDate', 'invoiceDate', 'serviceDescription',
  'placeOfDelivery', 'brazilBiCep', 'logoUrl', 'signatureUrl',
  'correspondent', 'circular', 'bookingNo', 'vessel',
  'portOfLoading', 'portOfDischarge', 'placeOfReceipt',
]

function normalizeData(formData: PdfFormData): PdfFormData {
  const result = { ...formData }
  for (const field of OPTIONAL_STRING_FIELDS) {
    if (result[field] === undefined || result[field] === null) {
      result[field] = ''
    }
  }
  if (!Array.isArray(result.blNumbers)) {
    result.blNumbers = []
  }
  return result
}

function templateData(formData: PdfFormData): PdfFormData & { blNumber: string } {
  const normalized = normalizeData(formData)
  const blNumbers = normalized.blNumbers as string[]
  const blNumber = blNumbers.length ? blNumbers.join(', ') : String((formData as { blNumber?: string }).blNumber ?? '')
  return { ...normalized, blNumber }
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

const PUPPETEER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--single-process',
]

const PDF_OPTIONS = {
  format: 'A4' as const,
  printBackground: true,
  margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
}

function launchBrowser() {
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ?? process.env.CHROME_PATH ?? undefined
  return puppeteer.launch({ headless: true, executablePath, args: PUPPETEER_ARGS })
}

function renderTemplate(templatePath: string, data: PdfFormData & { blNumber: string }): string {
  const template = fs.readFileSync(templatePath, 'utf-8')
  return ejs.render(template, data, { filename: templatePath })
}

export async function generateSinglePdf(
  baseTemplateName: string,
  formData: PdfFormData,
): Promise<Buffer> {
  const templatePath = resolveTemplatePath(baseTemplateName, formData.templateGroup)
  const withImages = await resolveImageUrls(formData)
  const data = templateData(withImages)
  const html = renderTemplate(templatePath, data)

  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf(PDF_OPTIONS)
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

export async function generatePdfs(formData: PdfFormData): Promise<PdfGenerationResult> {
  const isServiceInvoice = formData.invoiceType === 'service'
  const invoiceBase = isServiceInvoice ? 'invoice-service.ejs' : 'invoice.ejs'

  const blTemplatePath = resolveTemplatePath('bl.ejs', formData.templateGroup)
  const paymentTemplatePath = resolveTemplatePath('payment.ejs', formData.templateGroup)
  const invoiceTemplatePath = resolveTemplatePath(invoiceBase, formData.templateGroup)

  const withImages = await resolveImageUrls(formData)
  const data = templateData(withImages)

  const blHtml = renderTemplate(blTemplatePath, data)
  const paymentHtml = renderTemplate(paymentTemplatePath, data)
  const invoiceHtml = renderTemplate(invoiceTemplatePath, data)

  const browser = await launchBrowser()
  try {
    const [blPage, paymentPage, invoicePage] = await Promise.all([
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
    ])

    await Promise.all([
      blPage.setContent(blHtml, { waitUntil: 'networkidle0' }),
      paymentPage.setContent(paymentHtml, { waitUntil: 'networkidle0' }),
      invoicePage.setContent(invoiceHtml, { waitUntil: 'networkidle0' }),
    ])

    const [blPdf, paymentPdf, invoicePdf] = await Promise.all([
      blPage.pdf(PDF_OPTIONS),
      paymentPage.pdf(PDF_OPTIONS),
      invoicePage.pdf(PDF_OPTIONS),
    ])

    return {
      bl: Buffer.from(blPdf).toString('base64'),
      payment: Buffer.from(paymentPdf).toString('base64'),
      invoice: Buffer.from(invoicePdf).toString('base64'),
    }
  } finally {
    await browser.close()
  }
}
