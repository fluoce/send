import { AppSidebar } from "@/components/navigation/app-sidebar"
import { AppTopbar } from "@/components/navigation/app-topbar"
import { ReactNode } from "react"

export default function DashboardMainLyaout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-full flex-col gap-8">
      <AppTopbar />
      <div className="flex h-full items-start justify-center">
        <AppSidebar />
        <div className="flex-1 overflow-x-auto border-l px-4">{children}</div>
      </div>
    </div>
  )
}
