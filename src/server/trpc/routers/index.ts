import { router } from '../trpc'
import { documentosRouter } from './documentos.router'
import { userRouter } from './user.router'
import { clientRouter } from './client.router'

export const appRouter = router({
  documentos: documentosRouter,
  user: userRouter,
  clients: clientRouter,
})

export type AppRouter = typeof appRouter
