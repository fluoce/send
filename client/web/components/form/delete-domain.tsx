"use client"

import { ApiKeyType } from "@/types/data/api-key-data"
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
import { useApiKeyDelete } from "@/hooks/use-api-key"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ErrorAlert } from "../shared/error-alert"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"

export function DeleteDomain({
  apiKey,
  children,
}: {
  children: ReactNode
  apiKey: ApiKeyType
}) {
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useState(false)

  const d = useApiKeyDelete()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API key ?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this API key? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {d?.isError && <ErrorAlert error={d?.error?.message} />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              d.mutateAsync({
                apiKeyId: apiKey.id,
                workspaceId,
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
