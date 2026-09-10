import { SidebarTrigger } from "../ui/sidebar"

export function 
AppTopbar() {
  return (
    <nav className="sticky top-0 z-20 flex h-12 items-center justify-between gap-2 border-b bg-sidebar p-2">
      <SidebarTrigger />
    </nav>
  )
}
