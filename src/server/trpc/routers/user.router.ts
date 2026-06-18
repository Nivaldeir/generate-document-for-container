import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = router({
  auth: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })
      if (!user || user.password !== input.password) return null
      const { password: _p, ...rest } = user
      return rest
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name ?? null,
          email: input.email,
          password: input.password,
        },
      })
      const { password: _p, ...rest } = user
      return rest
    }),
})
