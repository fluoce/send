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
import { TemplateType } from "@/types/data/template-data"
import { useTemplateDelete } from "@/hooks/use-template"
import { Button } from "../ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

export function DeleteTemplate({
  template,
  children,
}: {
  children: ReactNode
  template: TemplateType
}) {
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useState(false)

  const d = useTemplateDelete()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this template? This
            action cannot be undone. All data related to this template will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {d?.isError && <ErrorAlert error={d?.error?.message} />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              d.mutateAsync({
                workspaceId,
                templateId: template.id,
              }).then(() => setOpen(false))
            }}
            disabled={d.isPending}
          >
            {d.isPending && <Spinner />} Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
