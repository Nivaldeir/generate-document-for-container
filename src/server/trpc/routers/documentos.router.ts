import { router, protectedProcedure } from '../trpc'

export const documentosRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const files = await ctx.prisma.uploadedFile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        sizeInBytes: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    })
    return files
  }),
})
