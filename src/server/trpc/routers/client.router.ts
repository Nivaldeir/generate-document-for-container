import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

const clientInput = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(1),
  address: z.string().min(1),
})

export const clientRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const clients = await ctx.prisma.client.findMany({
        orderBy: { name: 'asc' },
      })
      return clients
    } catch (error) {
      console.error('[client.list] error:', error)
      throw error
    }
  }),

  create: publicProcedure.input(clientInput).mutation(async ({ ctx, input }) => {
    const client = await ctx.prisma.client.create({
      data: {
        name: input.name,
        cnpj: input.cnpj,
        address: input.address,
      },
    })
    return client
  }),
})

