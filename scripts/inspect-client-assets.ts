import { existsSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
config()

const PUBLIC_UPLOAD = join(process.cwd(), 'public', 'upload')

async function main() {
  const { prisma } = await import('../src/shared/lib/prisma.ts')
  const clients = await prisma.client.findMany({
    select: { id: true, name: true, logoUrl: true, signatureUrl: true },
    orderBy: { name: 'asc' },
  })

  let local = 0
  let missing = 0
  let alreadyMigrated = 0
  let httpExternal = 0
  let empty = 0

  for (const c of clients) {
    for (const field of ['logoUrl', 'signatureUrl'] as const) {
      const url = c[field]
      if (!url) {
        empty++
        continue
      }
      if (url.startsWith('/api/asset')) {
        alreadyMigrated++
        continue
      }
      if (url.startsWith('/upload/')) {
        const fileName = url.replace(/^\/upload\//, '')
        const filePath = join(PUBLIC_UPLOAD, fileName)
        if (existsSync(filePath)) {
          local++
          console.log(`LOCAL OK    ${c.name} ${field} -> ${fileName}`)
        } else {
          missing++
          console.log(`LOCAL MISS  ${c.name} ${field} -> ${fileName}`)
        }
        continue
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        httpExternal++
        console.log(`HTTP        ${c.name} ${field} -> ${url}`)
        continue
      }
      console.log(`UNKNOWN     ${c.name} ${field} -> ${url}`)
    }
  }

  console.log('\n--- summary ---')
  console.log(`clients: ${clients.length}`)
  console.log(`already migrated (/api/asset): ${alreadyMigrated}`)
  console.log(`local file present: ${local}`)
  console.log(`local file missing: ${missing}`)
  console.log(`external http url: ${httpExternal}`)
  console.log(`empty: ${empty}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
