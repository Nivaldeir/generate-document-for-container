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
        batchId: true,
        kind: true,
      },
    })

    type SimpleFile = (typeof files)[number]

    const groups = new Map<string, {
      id: string
      batchId: string | null
      createdAt: Date
      bl?: SimpleFile
      payment?: SimpleFile
      invoice?: SimpleFile
      others: SimpleFile[]
    }>()

    for (const file of files) {
      const key = file.batchId ?? file.id
      let group = groups.get(key)
      if (!group) {
        group = {
          id: key,
          batchId: file.batchId ?? null,
          createdAt: file.createdAt,
          others: [],
        }
        groups.set(key, group)
      }

      const kind = file.kind
      if (kind === 'bl') {
        group.bl = file
      } else if (kind === 'payment') {
        group.payment = file
      } else if (kind === 'invoice') {
        group.invoice = file
      } else {
        group.others.push(file)
      }
    }

    return Array.from(groups.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }),
})
