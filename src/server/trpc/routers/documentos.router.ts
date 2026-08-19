import { router, publicProcedure } from '../trpc'

type FormDataShape = {
  invoiceNumber?: string
  blNumbers?: string[]
  invoiceType?: string
}

export const documentosRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const jobs = await ctx.prisma.pdfGenerationJob.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        batchId: true,
        formData: true,
        createdAt: true,
        completedAt: true,
      },
    })

    return jobs.map((job) => {
      let form: FormDataShape = {}
      try {
        form = JSON.parse(job.formData) as FormDataShape
      } catch {
        form = {}
      }
      const blLabel = Array.isArray(form.blNumbers) && form.blNumbers.length
        ? form.blNumbers.join(', ')
        : ''
      return {
        id: job.id,
        batchId: job.batchId,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        invoiceNumber: form.invoiceNumber ?? '',
        blLabel,
        invoiceType: form.invoiceType ?? '',
      }
    })
  }),
})
