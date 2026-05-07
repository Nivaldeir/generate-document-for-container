import { existsSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
config()

const PUBLIC_UPLOAD = join(process.cwd(), 'public', 'upload')
const DRY_RUN = process.argv.includes('--dry-run')

function extractMinioObjectName(url: string): string | null {
  try {
    const u = new URL(url)
    const parts = u.pathname.replace(/^\/+/, '').split('/')
    if (parts.length < 2) return null
    return parts.slice(1).join('/')
  } catch {
    return null
  }
}

function buildAssetUrl(objectName: string): string {
  return `/api/asset?key=${encodeURIComponent(objectName)}`
}

type Field = 'logoUrl' | 'signatureUrl'
type Action = 'rewrite-minio' | 'clear-missing' | 'keep'

function planAction(url: string | null): { action: Action; newValue: string | null } {
  if (!url) return { action: 'keep', newValue: null }
  if (url.startsWith('/api/asset')) return { action: 'keep', newValue: url }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const objectName = extractMinioObjectName(url)
    if (!objectName) return { action: 'keep', newValue: url }
    return { action: 'rewrite-minio', newValue: buildAssetUrl(objectName) }
  }
  if (url.startsWith('/upload/')) {
    const fileName = url.replace(/^\/upload\//, '')
    const filePath = join(PUBLIC_UPLOAD, fileName)
    if (existsSync(filePath)) return { action: 'keep', newValue: url }
    return { action: 'clear-missing', newValue: null }
  }
  return { action: 'keep', newValue: url }
}

async function main() {
  const { prisma } = await import('../src/shared/lib/prisma.ts')
  const clients = await prisma.client.findMany({
    select: { id: true, name: true, logoUrl: true, signatureUrl: true },
  })

  const counts: Record<Action, number> = { 'rewrite-minio': 0, 'clear-missing': 0, keep: 0 }
  const updates: Array<{ id: string; data: Partial<Record<Field, string | null>> }> = []

  for (const c of clients) {
    const data: Partial<Record<Field, string | null>> = {}
    for (const field of ['logoUrl', 'signatureUrl'] as const) {
      const { action, newValue } = planAction(c[field])
      counts[action]++
      if (action !== 'keep') {
        data[field] = newValue
        console.log(`${action.padEnd(15)} ${c.name} ${field}`)
        console.log(`   from: ${c[field]}`)
        console.log(`   to  : ${newValue}`)
      }
    }
    if (Object.keys(data).length) updates.push({ id: c.id, data })
  }

  console.log('\n--- plan ---')
  console.log(`rewrite (MinIO console -> /api/asset): ${counts['rewrite-minio']}`)
  console.log(`clear missing (file gone -> null)    : ${counts['clear-missing']}`)
  console.log(`keep                                  : ${counts.keep}`)
  console.log(`clients to update                     : ${updates.length}`)

  if (DRY_RUN) {
    console.log('\n[dry-run] no changes applied')
  } else {
    for (const u of updates) {
      await prisma.client.update({ where: { id: u.id }, data: u.data })
    }
    console.log(`\napplied ${updates.length} updates`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
