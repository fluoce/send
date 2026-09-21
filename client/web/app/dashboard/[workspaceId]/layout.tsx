import { AppTopbar } from "@/components/navigation/app-topbar"
import { ReactNode } from "react"

export default function DashboardMainLyaout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <AppTopbar />
      <div className="w-full flex-1 overflow-x-auto px-4">{children}</div>
    </div>
  )
}
