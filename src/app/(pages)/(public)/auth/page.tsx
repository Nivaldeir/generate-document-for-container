import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { FileText } from 'lucide-react'
import { Login } from './_components/login'
import { Suspense } from 'react'

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" aria-hidden />
      <Card className="w-full max-w-[400px] shadow-2xl border-slate-700/50 bg-slate-800/95 backdrop-blur-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardHeader className="space-y-3 pb-2 pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1.5 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              Entrar
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sistema de Geração de Documentos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pb-8 pt-2">
          <Suspense>
            <Login />
          </Suspense>
          <p className="text-center text-xs text-slate-500">
            Credenciais de teste: <span className="text-slate-400">admin@admin.com</span> / <span className="text-slate-400">admin</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}