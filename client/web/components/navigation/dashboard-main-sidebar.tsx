import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SelectWorkspace } from "../shared/select-workspace"
import Link from "next/link"
import { dashboardRoute } from "@/const/route"

export function DashboardMainSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem className="flex items-center gap-2">
          <Link href={dashboardRoute.base}>
            <img src="/Send-Fluoce.svg" alt="Logo" className="h-8 w-8" />
          </Link>
          <SelectWorkspace />
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
