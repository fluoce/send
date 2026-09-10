"use client"

import { ChevronsUpDown, LogOut, Moon, Palette, Sun } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/use-user"
import { Kbd } from "../ui/kbd"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useAuthLogout } from "@/action/auth/logout"
import { useTheme } from "next-themes"
import useLocalStorage from "@/hooks/use-local-storage"
import { localStorageKey } from "@/const/local-storage-key"
import { envs } from "@/const/envs"
import { useState } from "react"
import { Spinner } from "../ui/spinner"

export function NavUser() {
  const [loading, setLoading] = useState(false)

  const { setTheme } = useTheme()

  const { data } = useUser()

  const { removeValue } = useLocalStorage({
    key: localStorageKey.selectedWorkspace,
  })

  const user = data?.data

  const logout = async () => {
    removeValue()
    setLoading(true)
    await useAuthLogout()
    setLoading(false)
    window.location.href = `${envs.authUrl}?ref=${encodeURIComponent(envs.appUrl)}`
  }

  return user ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.photo!} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-[13px] leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-[11px]">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full" align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.photo!} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette /> Theme
                <DropdownMenuShortcut>
                  <Kbd>t</Kbd>
                </DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setTheme("light")}>
                  <Sun /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("dark")}>
                  <Moon /> Dark
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  variant="destructive"
                >
                  {loading ? <Spinner /> : <LogOut />}
                  Log out
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to sign in
                    again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : null
}
