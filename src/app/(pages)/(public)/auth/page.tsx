import { FileSearch, FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { Login } from './_components/login'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[oklch(0.22_0.04_172)] text-white p-12">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, oklch(0.55 0.14 172) 0%, transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.45 0.14 200) 0%, transparent 55%), linear-gradient(135deg, oklch(0.20 0.05 172) 0%, oklch(0.16 0.04 220) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Sistema de Geração de Documentos
          </span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Documentos prontos
              <br />
              em segundos.
            </h1>
            <p className="text-base text-white/70 max-w-md">
              Crie, organize e gere documentos personalizados a partir de
              formulários inteligentes, com agilidade e total controlo.
            </p>
          </div>

          <ul className="space-y-4 text-sm text-white/85">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-white">Geração automatizada</p>
                <p className="text-white/65">
                  Modelos dinâmicos preenchidos em segundos.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                <FileSearch className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-white">Histórico centralizado</p>
                <p className="text-white/65">
                  Localize e reutilize documentos a qualquer momento.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-white">Acesso seguro</p>
                <p className="text-white/65">
                  Autenticação e permissões controladas por perfil.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.22_0.04_172)] text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-muted-foreground">
              Aceda à plataforma de geração de documentos.
            </p>
          </div>

          <Suspense>
            <Login />
          </Suspense>

          <p className="text-center text-xs text-muted-foreground">
            Credenciais de teste:{' '}
            <span className="text-foreground/70">admin@admin.com</span> /{' '}
            <span className="text-foreground/70">admin</span>
          </p>
        </div>
      </div>
    </div>
  )
}
