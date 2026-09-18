"use client"

import { ReactNode, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { ErrorAlert } from "../shared/error-alert"
import { Spinner } from "../ui/spinner"
import { WorkspaceType } from "@/types/data/workspace-data"
import { useWorkspaceDelete } from "@/hooks/use-workspace"
import { Button } from "../ui/button"

export function DeleteWorkspace({
  workspace,
  children,
}: {
  children: ReactNode
  workspace: WorkspaceType
}) {
  const [open, setOpen] = useState(false)

  const d = useWorkspaceDelete()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Workspace ?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this workspace? This
            action cannot be undone. All things related to this workspace will
            be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {d?.isError && <ErrorAlert error={d?.error?.message} />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              d.mutateAsync({
                workspaceId: workspace.id,
              }).then(() => setOpen(false))
            }}
          >
            {d.isPending && <Spinner />} Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
