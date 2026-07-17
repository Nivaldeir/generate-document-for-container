import { SidebarProvider, SidebarInset } from '@/src/shared/components/ui/sidebar'
import { AppSidebar } from './_components/app-sidebar'
import { AppHeader } from './_components/app-header'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
          <SidebarProvider className="h-svh overflow-hidden bg-sidebar">
						<AppSidebar />
						<SidebarInset className="m-2 overflow-hidden rounded-xl shadow-sm">
							<div className="flex-1 overflow-auto">{children}</div>
						</SidebarInset>
					</SidebarProvider>
  )
}
