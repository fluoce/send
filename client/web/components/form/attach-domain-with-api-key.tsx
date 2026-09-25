"use client"

import { useVerifiedDomains } from "@/hooks/use-domain"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { DomainType } from "@/types/data/domain-data"
import { ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Spinner } from "../ui/spinner"
import { Globe, GlobeX, Plus } from "lucide-react"
import { dashboardRoute } from "@/const/route"
import Link from "next/link"
import { ErrorAlert } from "../shared/error-alert"
import { funcTrunc } from "@/func/func-trunc"
import { RemoveDomainFromApiKey } from "./remove-domain-from-api-key"
import { useApiKeyAttechDomain } from "@/hooks/use-api-key"
import { ApiKeyType } from "@/types/data/api-key-data"

export function AttachDomainWithApiKey({
  children,
  apiKey,
  domain,
}: {
  children: ReactNode
  domain?: DomainType
  apiKey: ApiKeyType
}) {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    control,
  } = useForm<{
    domainId: string
  }>({
    defaultValues: {
      domainId: domain?.id || "",
    },
  })

  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useState(false)

  const { data, isLoading } = useVerifiedDomains({
    workspaceId,
    enabled: open,
  })

  const u = useApiKeyAttechDomain()

  function submit(body: { domainId: string }) {
    if (!body.domainId) {
      setError("domainId", {
        message: "Select Domain",
      })
    }
    if (domain && domain?.id === body.domainId) {
      setError("domainId", {
        message: "This domain is already attached.",
      })
    }
    u.mutateAsync({
      apiKeyId: apiKey.id,
      workspaceId,
      body: {
        domainId: body.domainId,
      },
    }).then(() => setOpen(false))
  }

  const Form = () => (
    <form onSubmit={handleSubmit(submit)}>
      <Field className="flex flex-col gap-4">
        <div>
          <FieldLabel htmlFor="attach-domain" className="text-base">
            {domain ? "Change Domain" : "Attach Domain"}
          </FieldLabel>
          <FieldDescription>
            {domain
              ? "Change the domain associated with this API key."
              : "Attach a verified domain to use with this API key."}
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel htmlFor="select-domain">Select Domain</FieldLabel>
          {isLoading ? (
            <div className="flex items-center justify-center p-1.5">
              <Spinner />
            </div>
          ) : (
            <Controller
              control={control}
              name="domainId"
              rules={{ required: "Domain is required." }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="select-domain" className="w-full py-4.5">
                    <SelectValue placeholder="Choose a domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <GlobeX /> None
                    </SelectItem>
                    {data?.data?.domains?.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        <Globe /> {d.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </Field>
        <Link
          tabIndex={-1}
          href={dashboardRoute.domain({
            workspaceId,
          })}
        >
          <Button variant="secondary" className="text-blue-500">
            <Plus />
            New Domain
          </Button>
        </Link>
        <Button className="h-10">{u.isPending && <Spinner />} Save</Button>
        {errors.domainId && <ErrorAlert error={errors?.domainId?.message!} />}
        {u.isError && <ErrorAlert error={u?.error?.message!} />}
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
            domainId: domain?.id || "",
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
