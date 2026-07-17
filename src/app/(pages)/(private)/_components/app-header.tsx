'use client'

import { Bell, Building2, ChevronsUpDown, MessageCircle, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { SidebarTrigger } from '@/src/shared/components/ui/sidebar'
import { Separator } from '@/src/shared/components/ui/separator'

export function AppHeader() {
  const [isDark, setIsDark] = useState(false)
  const [notifications] = useState(3)

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <header className="sticky top-0 z-30 flex h-[65px] shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />
      <Separator orientation="vertical" className="mr-1 h-6" />

      <button
        type="button"
        className="flex items-center gap-3 rounded-lg border bg-background px-3 py-1.5 text-left transition-colors hover:bg-muted/60"
      >
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Building2 className="size-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            Sistema de Documentos
          </span>
          <span className="text-[11px] text-muted-foreground">
            Geração e gestão
          </span>
        </div>
        <ChevronsUpDown className="ml-2 size-3.5 text-muted-foreground" />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <HeaderIconButton onClick={toggleTheme} ariaLabel="Alternar tema">
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </HeaderIconButton>

        <HeaderIconButton ariaLabel="Notificações">
          <Bell className="size-4" />
          {notifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold leading-none text-primary-foreground ring-2 ring-background">
              {notifications}
            </span>
          )}
        </HeaderIconButton>

        <HeaderIconButton ariaLabel="Mensagens">
          <MessageCircle className="size-4" />
        </HeaderIconButton>
      </div>
    </header>
  )
}

function HeaderIconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  )
}
