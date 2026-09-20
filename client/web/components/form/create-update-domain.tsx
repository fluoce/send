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
import { useDomainCreate } from "@/hooks/use-domain"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { ErrorAlert } from "../shared/error-alert"
import { Input } from "../ui/input"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { DomainCreateType } from "@/types/payload/domain-payload"
import { domainRegex } from "@/const/regex"

export function CreateUpdateDomain({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const workspaceId = useWorkspaceId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<DomainCreateType>({
    defaultValues: {
      domain: "",
    },
  })

  const c = useDomainCreate()

  function submit(body: DomainCreateType) {
    if (!body.domain) {
      setError("domain", {
        message: "Domain is required.",
      })
      return
    }
    if (!domainRegex.test(body.domain)) {
      setError("domain", {
        message: "Enter a valid domain.",
      })
      return
    }
    c.mutateAsync({
      body: {
        domain: body.domain,
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
          <FieldLabel htmlFor="create-domain" className="text-base">
            Add Domain
          </FieldLabel>
          <FieldDescription>
            Add a new domain to your workspace.
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel htmlFor="domain">Domain</FieldLabel>
          <Input
            autoFocus
            className="h-10"
            id="domain"
            placeholder="example.com"
            {...register("domain", {
              required: "Domain is required.",
            })}
          />
        </Field>
        <Button className="h-10" disabled={c.isPending}>
          {c.isPending && <Spinner />} Create
        </Button>
        {errors?.domain && <ErrorAlert error={errors?.domain?.message!} />}
        {c.isError && <ErrorAlert error={c.error?.message} />}
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
            domain: "",
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
