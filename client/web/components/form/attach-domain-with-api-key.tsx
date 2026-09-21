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
import { Plus } from "lucide-react"
import { dashboardRoute } from "@/const/route"
import Link from "next/link"

export function AttachDomainWithApiKey({
  children,
  domain,
}: {
  children: ReactNode
  domain?: DomainType
}) {
  const {
    register,
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

  function submit(body: { domainId: string }) {}

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
          ) : data?.data?.domains?.length ? (
            <Controller
              control={control}
              name="domainId"
              rules={{ required: "Domain is required." }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="select-domain" className="h-10 w-full">
                    <SelectValue
                      className="h-10"
                      placeholder="Choose a domain..."
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.data?.domains?.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Link
              tabIndex={-1}
              href={dashboardRoute.domain({
                workspaceId,
              })}
            >
              <Button variant="secondary" className="text-blue-500">
                <Plus /> Domain
              </Button>
            </Link>
          )}
        </Field>

        <Button className="h-10">Save</Button>
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
