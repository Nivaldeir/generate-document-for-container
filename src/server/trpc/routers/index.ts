import { router } from '../trpc'
import { documentosRouter } from './documentos.router'
import { userRouter } from './user.router'

export const appRouter = router({
  documentos: documentosRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
