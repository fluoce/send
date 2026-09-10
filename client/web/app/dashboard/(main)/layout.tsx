import { DashboardMainSidebar } from "@/components/navigation/dashboard-main-sidebar"
import { AppTopbar } from "@/components/navigation/app-topbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"

export default function DashboardMainLyaout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardMainSidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <div className="min-h-0 w-full flex-1 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  )
}
