"use client"

import Link from "next/link"
import { dashboardRoute } from "@/const/route"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Key } from "lucide-react"

export function AppSidebar() {
  const workspaceId = useWorkspaceId()

  return (
    <div className="h-full w-40 px-4">
      <Link
        tabIndex={-1}
        href={dashboardRoute.apiKey({ workspaceId })}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
      >
        <Key size={16} /> Api Keys
      </Link>
    </div>
  )
}
