"use client"

import { ApiKeyType } from "@/types/data/api-key-data"
import { ReactNode, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Controller, useForm } from "react-hook-form"
import {
  ApiKeyCreateType,
  ApiKeyUpdateType,
} from "@/types/payload/api-key-payload"
import { useApiKeyCreate, useApiKeyUpdate } from "@/hooks/use-api-key"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { ErrorAlert } from "../shared/error-alert"
import { Input } from "../ui/input"
import { DatePicker } from "../ui/date-picker"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

export function CreateUpdateDomain({
  apiKey,
  children,
}: {
  children: ReactNode
  apiKey?: ApiKeyType
}) {
  const [open, setOpen] = useState(false)

  const workspaceId = useWorkspaceId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    control,
  } = useForm<
    ApiKeyCreateType & {
      status?: ApiKeyUpdateType["status"]
    }
  >({
    defaultValues: {
      expireAt: apiKey?.expireAt || "",
      name: apiKey?.name || "",
      status: apiKey?.status || "ACTIVE",
    },
  })

  useEffect(() => {
    reset({
      name: apiKey?.name || "",
      expireAt: apiKey?.expireAt || "",
      status: apiKey?.status || "ACTIVE",
    })
  }, [apiKey, open, reset])

  const c = useApiKeyCreate()
  const u = useApiKeyUpdate()

  function submit(body: ApiKeyUpdateType) {
    if (apiKey) {
      if (apiKey?.name === body?.name && apiKey?.expireAt === body?.expireAt) {
        setError("name", {
          message: "No any change to update",
        })
        return
      }

      u.mutateAsync({
        apiKeyId: apiKey?.id,
        body,
        workspaceId: apiKey.workspaceId,
      }).then(() => {
        setOpen(false)
      })
    } else {
      if (!body.name) {
        setError("name", {
          message: "Api key name is required",
        })
      }
      c.mutateAsync({
        body: {
          name: body?.name!,
          expireAt: body.expireAt,
        },
        workspaceId,
      }).then(() => {
        setOpen(false)
      })
    }
  }

  const Form = () => (
    <form onSubmit={handleSubmit(submit)}>
      <Field className="flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="create-api-key" className="text-base">
            {apiKey ? "Update Api key" : "Create Api key"}
          </FieldLabel>
          <FieldDescription>
            {apiKey
              ? "Update your API key details below."
              : "Create a new API key by filling out the details below."}
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel htmlFor="key-name">Key Name</FieldLabel>
          <Input
            autoFocus
            className="h-10"
            id="key-name"
            placeholder="Api key name . . . "
            {...register("name", {
              required: "Api key name is required.",
            })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="key-expireat">Expire At</FieldLabel>
          <Controller
            control={control}
            name="expireAt"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                className="h-10"
                date={value ? new Date(value) : ""}
                setDate={(date) => {
                  onChange(date)
                }}
                disabledDate={new Date()}
              />
            )}
          />
        </Field>
        <Button className="h-10" disabled={c.isPending || u.isPending}>
          {(c.isPending || u.isPending) && <Spinner />}{" "}
          {apiKey ? "Update" : "Create"}
        </Button>
        {errors?.name && <ErrorAlert error={errors?.name?.message!} />}
        {c.isError && <ErrorAlert error={c.error?.message} />}
        {u.isError && <ErrorAlert error={u.error?.message} />}
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
            name: apiKey?.name || "",
            expireAt: apiKey?.expireAt || "",
            status: apiKey?.status || "ACTIVE",
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
