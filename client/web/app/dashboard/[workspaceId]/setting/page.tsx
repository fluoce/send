"use client"

import { CreateUpdateWorkspace } from "@/components/form/create-update-workspace"
import { DeleteWorkspace } from "@/components/form/delete-workpsace"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWorkspace, useWorkspaceUpdate } from "@/hooks/use-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {
  WorksapceStatus,
  WorkspaceStatusType,
} from "@/types/data/workspace-data"
import { cn } from "cn"
import { Edit } from "lucide-react"

export default function SettingPage() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading } = useWorkspace({
    workspaceId,
  })

  const u = useWorkspaceUpdate()

  const workspace = data?.data?.workspace

  if (isLoading) {
    return <PageSpinner />
  }

  return workspace ? (
    <PageWrapper>
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
                disabled={u.isPending}
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
            disabled={u.isPending}
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
              {WorksapceStatus?.map((s) => (
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
          <DeleteWorkspace workspace={workspace}>
            <Button
              variant="destructive"
              className="mt-2"
              disabled={u.isPending}
            >
              Delete
            </Button>
          </DeleteWorkspace>
        </div>
      </div>
    </PageWrapper>
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
