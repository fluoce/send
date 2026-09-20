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
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ErrorAlert } from "../shared/error-alert"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { useDomainDelete } from "@/hooks/use-domain"

export function DeleteDomain({
  domainId,
  children,
}: {
  children: ReactNode
  domainId: string
}) {
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useState(false)

  const d = useDomainDelete()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Domain ?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this domain? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {d?.isError && <ErrorAlert error={d?.error?.message} />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              d.mutateAsync({
                domainId,
                workspaceId,
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
