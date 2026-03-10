import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

const clientInput = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(1),
  address: z.string().min(1),
  beneficiaryBank: z.string().optional(),
  bankCode: z.string().optional(),
  branchCode: z.string().optional(),
  swiftCode: z.string().optional(),
  swiftBic: z.string().optional(),
  intermediaryBank: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  beneficiaryAddress: z.string().optional(),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
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
        beneficiaryBank: input.beneficiaryBank ?? null,
        bankCode: input.bankCode ?? null,
        branchCode: input.branchCode ?? null,
        swiftCode: input.swiftCode ?? null,
        swiftBic: input.swiftBic ?? null,
        intermediaryBank: input.intermediaryBank ?? null,
        accountNumber: input.accountNumber ?? null,
        routingNumber: input.routingNumber ?? null,
        beneficiaryAddress: input.beneficiaryAddress ?? null,
        logoUrl: input.logoUrl ?? null,
        signatureUrl: input.signatureUrl ?? null,
      },
    })
    return client
  }),

  update: publicProcedure
    .input(clientInput.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const client = await ctx.prisma.client.update({
        where: { id },
        data: {
          name: data.name,
          cnpj: data.cnpj,
          address: data.address,
          beneficiaryBank: data.beneficiaryBank ?? null,
          bankCode: data.bankCode ?? null,
          branchCode: data.branchCode ?? null,
          swiftCode: data.swiftCode ?? null,
          swiftBic: data.swiftBic ?? null,
          intermediaryBank: data.intermediaryBank ?? null,
          accountNumber: data.accountNumber ?? null,
          routingNumber: data.routingNumber ?? null,
          beneficiaryAddress: data.beneficiaryAddress ?? null,
          logoUrl: data.logoUrl ?? null,
          signatureUrl: data.signatureUrl ?? null,
        },
      })
      return client
    }),
})

