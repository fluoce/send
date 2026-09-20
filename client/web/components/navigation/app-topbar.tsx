"use client"

import { dashboardRoute, externalRoute } from "@/const/route"
import { NavUser } from "./nav-user"
import { SelectWorkspace } from "../shared/select-workspace"
import { AppMenu } from "./app-menu"

export function AppTopbar() {
  return (
    <nav className="sticky top-0 z-20 flex flex-col bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-2 py-3">
        <div className="flex flex-wrap items-start">
          <a href={dashboardRoute.base} className="flex items-center gap-1">
            <img src="/Send-Fluoce.svg" alt="form-fluoce" className="h-8 w-8" />
            <h1 className="text-2xl font-semibold tracking-tight text-[#F0B118]">
              Send
            </h1>
          </a>
          <span className="mx-2 flex items-center gap-0.5 text-xs font-semibold text-muted-foreground">
            by
            <a
              target="_blank"
              className="hover:text-(--form) hover:underline"
              href={externalRoute.fluoce}
            >
              Fluoce
            </a>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SelectWorkspace />
          <NavUser />
        </div>
      </div>
      <AppMenu />
    </nav>
  )
}
