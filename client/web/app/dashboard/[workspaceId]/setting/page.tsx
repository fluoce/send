"use client"

import { CreateUpdateWorkspace } from "@/components/form/create-update-workspace"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
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
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  useWorkspace,
  useWorkspaceDelete,
  useWorkspaceUpdate,
} from "@/hooks/use-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { WorkspaceStatusType } from "@/types/data/workspace-data"
import { cn } from "cn"
import { Edit, Trash2 } from "lucide-react"

const WORKSPACE_STATUS: WorkspaceStatusType[] = ["ACTIVE", "DEACTIVE"]

export default function WorkspaceSetting() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading } = useWorkspace({
    workspaceId,
  })

  const u = useWorkspaceUpdate()

  const d = useWorkspaceDelete()

  const isPending = u.isPending || d.isPending

  const workspace = data?.data?.workspace

  if (isLoading) {
    return <PageSpinner />
  }

  return workspace ? (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Workspace"
        description={`Manage settings for your workspace.`}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Avatar className="size-10">
            <AvatarFallback>
              {workspace?.name[0].slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm">{workspace?.name}</h3>
            <CreateUpdateWorkspace workspace={workspace}>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="text-blue-500"
              >
                <Edit />
              </Button>
            </CreateUpdateWorkspace>
          </div>
        </div>
        <div>
          <Span text="Status" />
          <Select
            disabled={isPending}
            defaultValue={workspace?.status}
            onValueChange={(v: WorkspaceStatusType) => {
              u.mutateAsync({
                body: {
                  status: v,
                },
                workspaceId: workspace?.id!,
              })
            }}
          >
            <SelectTrigger className="cursor-pointer text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORKSPACE_STATUS?.map((s) => (
                <SelectItem value={s} key={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Span text="Delete Workspace" className="text-red-500" />
          <p className="mb-2 max-w-80 text-xs text-muted-foreground">
            Permanently deleting this workspace will remove all things
            associated with it.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="mt-2"
                disabled={isPending}
              >
                {d.isPending ? <Spinner /> : <Trash2 />} Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Workspace "{workspace?.name}"?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete this workspace?
                  This action cannot be undone. All things related to this
                  workspace will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    d.mutateAsync({
                      workspaceId: workspace?.id!,
                    })
                  }
                  variant="destructive"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  ) : null
}

function Span({ text, className }: { text: string; className?: string }) {
  if (!text) return null
  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {text}
    </span>
  )
}
