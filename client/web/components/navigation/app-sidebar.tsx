"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { dashboardRoute } from "@/const/route"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Key } from "lucide-react"

export function AppSidebar() {
  const workspaceId = useWorkspaceId()

  return (
    <div className="h-full w-40 border-r px-2">
      <Link
        tabIndex={-1}
        href={dashboardRoute.apiKey({ workspaceId })}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
      >
        <Key size={18} /> Api Keys
      </Link>
    </div>
  )
}
