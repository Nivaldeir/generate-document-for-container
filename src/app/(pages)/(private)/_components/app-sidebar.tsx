'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/src/shared/components/ui/sidebar'
import {
  Avatar,
  AvatarFallback,
} from '@/src/shared/components/ui/avatar'
import {
  Briefcase,
  FileText,
  Files,
  LogOut,
  List,
  Users,
} from 'lucide-react'

type NavItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

type NavSection = {
  label: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    label: 'Operações',
    items: [
      { title: 'Serviços', url: '/', icon: FileText },
      { title: 'Fretes', url: '/fretes', icon: Briefcase },
      { title: 'Listar Documentos', url: '/formulary/docs', icon: List },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { title: 'Clientes', url: '/clients', icon: Users },
    ],
  },
]

// Override sidebar tokens to a fixed dark palette regardless of theme.
const darkSidebarStyle = {
  '--sidebar-background': '222 25% 9%',
  '--sidebar-foreground': '215 16% 75%',
  '--sidebar-primary': '172 65% 42%',
  '--sidebar-primary-foreground': '0 0% 100%',
  '--sidebar-accent': '222 22% 14%',
  '--sidebar-accent-foreground': '0 0% 98%',
  '--sidebar-border': '222 20% 16%',
  '--sidebar-ring': '172 65% 42%',
} as React.CSSProperties

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" style={darkSidebarStyle}>
      <SidebarHeader className="border-b border-sidebar-border h-[65px] justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" className="flex items-center gap-2.5" />}
              className="hover:bg-transparent active:bg-transparent"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Files className="size-5" />
              </div>
              <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Documentos
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  Plataforma de geração
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {sections.map((section) => (
          <NavGroup key={section.label} section={section} />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <UserCard />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavGroup({ section }: { section: NavSection }) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">
        {section.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== '/' && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={isActive}
                  tooltip={item.title}
                  className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function UserCard() {
  const { data: session } = useSession()
  const { state } = useSidebar()
  const name = session?.user?.name ?? 'Utilizador'
  const email = session?.user?.email ?? ''
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-2 rounded-md p-1.5">
      <Avatar className="size-8 ring-1 ring-sidebar-border">
        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium">
          {initials || 'U'}
        </AvatarFallback>
      </Avatar>
      {state === 'expanded' && (
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-medium text-sidebar-foreground">
            {name}
          </span>
          {email && (
            <span className="truncate text-[11px] text-sidebar-foreground/60">
              {email}
            </span>
          )}
        </div>
      )}
      {state === 'expanded' && (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/auth' })}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Sair"
        >
          <LogOut className="size-4" />
        </button>
      )}
    </div>
  )
}
