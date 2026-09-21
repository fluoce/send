import { dashboardRoute } from "@/const/route"
import { useWorkspaceCreate, useWorkspaceUpdate } from "@/hooks/use-workspace"
import { WorkspaceCreateType } from "@/types/payload/workspace-payload"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { ErrorAlert } from "../shared/error-alert"
import { Input } from "../ui/input"
import { WorkspaceType } from "@/types/data/workspace-data"

export function CreateUpdateWorkspace({
  children,
  page = false,
  workspace,
}: {
  children?: ReactNode
  page?: boolean
  workspace?: WorkspaceType
}) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<WorkspaceCreateType>({
    defaultValues: {
      name: workspace?.name || "",
    },
  })

  useEffect(() => {
    reset({
      name: workspace?.name || "",
    })
  }, [workspace, open, reset])

  const c = useWorkspaceCreate()

  const u = useWorkspaceUpdate()

  function submit(body: WorkspaceCreateType) {
    if (workspace) {
      if (workspace?.name == body.name) {
        setError("name", {
          message: "Workspace name has not changed.",
        })
        return
      }
      u.mutateAsync({
        body: {
          name: body?.name,
        },
        workspaceId: workspace.id,
      }).then(() => setOpen(false))
    } else {
      c.mutateAsync({
        body,
      }).then(() => {
        page ? router.replace(dashboardRoute.base) : setOpen(false)
      })
    }
  }

  const Form = () => {
    return (
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-100">
        <Field className="flex flex-col gap-4">
          <div>
            <FieldLabel htmlFor="create-workspace" className="text-base">
              {workspace ? "Update Workspace" : "Create Workspace"}
            </FieldLabel>
            <FieldDescription>
              {workspace
                ? "Update your workspace details below."
                : " A workspace allows you to organize and manage your API keys efficiently without interruptions place."}
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
            <Input
              autoFocus
              className="h-10"
              id="workspace-name"
              placeholder="workspace name . . . "
              {...register("name", {
                required: "workspace name is required.",
              })}
            />
          </Field>
          <Button className="h-10" disabled={c.isPending || u.isPending}>
            {(c.isPending || u.isPending) && <Spinner />}{" "}
            {workspace ? "Update" : "Create"}
          </Button>
          {errors?.name && <ErrorAlert error={errors?.name?.message!} />}
          {c.isError && <ErrorAlert error={c.error?.message} />}
          {u.isError && <ErrorAlert error={u.error?.message} />}
        </Field>
      </form>
    )
  }

  if (page) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Form />
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) {
          reset({
            name: workspace?.name || "",
          })
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-0">
        <DialogHeader className="h-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form />
      </DialogContent>
    </Dialog>
  )
}
