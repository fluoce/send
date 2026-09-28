"use client"

import { ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useForm } from "react-hook-form"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { ErrorAlert } from "../shared/error-alert"
import { Input } from "../ui/input"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { TemplateCreateType } from "@/types/payload/template-payload"
import { useTemplateCreate } from "@/hooks/use-template"

export function CreateTemplate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const workspaceId = useWorkspaceId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<TemplateCreateType>({
    defaultValues: {
      name: "",
    },
  })

  const c = useTemplateCreate()

  function submit(body: TemplateCreateType) {
    if (!body.name) {
      setError("name", {
        message: "Name is required.",
      })
      return
    }
    c.mutateAsync({
      body: {
        name: body.name,
      },
      workspaceId,
    }).then(() => {
      setOpen(false)
      reset()
    })
  }

  const Form = () => (
    <form onSubmit={handleSubmit(submit)}>
      <Field className="flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="create-template" className="text-base">
            Create Template
          </FieldLabel>
          <FieldDescription>
            Add a new template to your workspace.
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel htmlFor="template-name">Template Name</FieldLabel>
          <Input
            autoFocus
            className="h-10"
            id="template-name"
            placeholder="Name . . ."
            {...register("name", {
              required: "Name is required.",
            })}
          />
        </Field>
        <Button className="h-10" disabled={c.isPending}>
          {c.isPending && <Spinner />} Create
        </Button>
        {errors?.name && errors.name.message && (
          <ErrorAlert error={errors.name.message} />
        )}
        {c.isError && c.error?.message && (
          <ErrorAlert error={c.error.message} />
        )}
      </Field>
    </form>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) {
          reset({
            name: "",
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
