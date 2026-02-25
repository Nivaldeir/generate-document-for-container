import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/src/shared/lib/prisma'

export async function createContext(_opts: FetchCreateContextFnOptions) {
  return { prisma }
}

export type Context = Awaited<ReturnType<typeof createContext>>
