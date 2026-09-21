"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { ChevronDown, Plus, Settings } from "lucide-react"
import { useWorkspaces } from "@/hooks/use-workspace"
import { useRouter } from "next/navigation"
import { dashboardRoute } from "@/const/route"
import useLocalStorage from "@/hooks/use-local-storage"
import { localStorageKey } from "@/const/local-storage-key"
import { Skeleton } from "../ui/skeleton"
import { ReactNode } from "react"
import { CreateUpdateWorkspace } from "../form/create-update-workspace"
import { Badge } from "../ui/badge"

export function SelectWorkspace({
  children,
  skeleton,
}: {
  children?: ReactNode
  skeleton?: ReactNode
}) {
  const router = useRouter()

  const { value, setValue } = useLocalStorage({
    key: localStorageKey.selectedWorkspace,
  })

  const { data, isLoading } = useWorkspaces()

  const selectedWorkspace = data?.data?.workspaces?.find((ws) => ws.id == value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoading ? (
          skeleton ? (
            skeleton
          ) : (
            <Skeleton className="h-9 flex-1"></Skeleton>
          )
        ) : children ? (
          children
        ) : (
          <Button
            className="flex max-w-40 flex-1 items-center justify-between"
            variant="secondary"
            size="lg"
          >
            <span className="truncate">{selectedWorkspace?.name}</span>
            <ChevronDown />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 max-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Current Workspace</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              router.push(
                dashboardRoute.workspaceSetting({
                  worksapceId: selectedWorkspace?.id!,
                })
              )
            }}
            className="justify-between px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="truncate">{selectedWorkspace?.name}</span>
              <Badge
                variant={
                  selectedWorkspace?.status == "ACTIVE"
                    ? "outline"
                    : "destructive"
                }
                className="text-[8px]"
              >
                {selectedWorkspace?.status}
              </Badge>
            </div>
            <Settings />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Other Workspaces</DropdownMenuLabel>
          {data?.data?.workspaces
            ?.filter((ws) => ws.id != selectedWorkspace?.id)
            ?.map((ws) => (
              <DropdownMenuItem
                className="px-4 py-2"
                key={ws?.id}
                onClick={() => {
                  setValue(ws?.id)
                  router.replace(
                    dashboardRoute.workspace({
                      workspaceId: ws?.id,
                    })
                  )
                }}
              >
                <span className="truncate">{ws?.name}</span>
                <Badge
                  variant={ws.status == "ACTIVE" ? "outline" : "destructive"}
                  className="text-[8px]"
                >
                  {ws?.status}
                </Badge>
              </DropdownMenuItem>
            ))}
          <CreateUpdateWorkspace
            children={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="px-4 py-2 text-blue-600"
              >
                <Plus /> Create Workspace
              </DropdownMenuItem>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
