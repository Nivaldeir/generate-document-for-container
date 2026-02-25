import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL não definida. Configure no .env (ex: DATABASE_URL="file:./dev.db")')
  }
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrismaClient()
export const prisma = globalForPrisma.prisma
