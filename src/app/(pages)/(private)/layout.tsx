import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/src/shared/components/ui/sidebar'
import { Separator } from '@/src/shared/components/ui/separator'
import { AppSidebar } from './_components/app-sidebar'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-[65px] shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <span className="text-sm font-medium">Área restrita</span>
        </header>
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}