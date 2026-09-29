"use client"

import { ErrorAlert } from "@/components/shared/error-alert"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useTemplateUpdateMeta } from "@/hooks/use-template"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { TemplateType } from "@/types/data/template-data"
import { ReactNode, useState } from "react"

export function UpdateTemplateStatus({
  children,
  template,
  disabled,
}: {
  children?: ReactNode
  template: TemplateType
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  const workspaceId = useWorkspaceId()

  const statusWillBe = template?.status == "PUBLISH" ? "DRAFT" : "PUBLISH"

  const u = useTemplateUpdateMeta()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger disabled={disabled} asChild>
        {children ? (
          children
        ) : (
          <Button variant={statusWillBe == "PUBLISH" ? "default" : "outline"}>
            Mark as {statusWillBe}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Update template from {template?.status} to {statusWillBe}.
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to make this template - {template?.name} as{" "}
            {statusWillBe} ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {u.isError && <ErrorAlert error={u?.error?.message!} />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() =>
              u
                .mutateAsync({
                  body: {
                    status: statusWillBe,
                  },
                  templateId: template?.id,
                  workspaceId,
                })
                .then(() => setOpen(false))
            }
            disabled={u.isPending}
          >
            {u.isPending && <Spinner />} {statusWillBe}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
