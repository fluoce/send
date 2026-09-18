import { AppSidebar } from "@/components/navigation/app-sidebar"
import { AppTopbar } from "@/components/navigation/app-topbar"
import { ReactNode } from "react"

export default function DashboardMainLyaout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-8">
      <AppTopbar />
      <div className="flex items-start gap-4">
        <AppSidebar />
        <div className="px-2">{children}</div>
      </div>
    </div>
  )
}
