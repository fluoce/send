"use client"

import Link from "next/link"
import { dashboardRoute, externalRoute } from "@/const/route"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ArrowUpRight, Globe, Key, LayoutDashboard } from "lucide-react"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation"

export function AppMenu() {
  const path = usePathname()

  const workspaceId = useWorkspaceId()

  const Menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard />,
      path: dashboardRoute.workspace({
        workspaceId,
      }),
    },
    {
      name: "API Key",
      icon: <Key />,
      path: dashboardRoute.apiKey({
        workspaceId,
      }),
    },
    {
      name: "Domain",
      icon: <Globe />,
      path: dashboardRoute.domain({
        workspaceId,
      }),
    },
  ]

  return (
    <div className="custom-scroll flex h-full w-full items-center justify-between gap-8 overflow-x-auto px-2 py-1 text-muted-foreground">
      <div className="flex items-center gap-2">
        {Menu.map((m) => (
          <Link key={m.name} tabIndex={-1} href={m.path}>
            <Button variant={path == m.path ? "secondary" : "ghost"} size="lg">
              {m.icon}
              {m.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Link href={externalRoute.sendDocs} tabIndex={-1} target="_blank">
          <Button variant="ghost" size="lg">
            <ArrowUpRight /> Docs
          </Button>
        </Link>
      </div>
    </div>
  )
}
