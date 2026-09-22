"use client"

import { DnsRecord, DomainType } from "@/types/data/domain-data"
import { ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { useDomainVerify } from "@/hooks/use-domain"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCopy } from "@/hooks/use-copy"
import { CheckCheck, Copy } from "lucide-react"
import { Spinner } from "../ui/spinner"

export function VerifyDomain({
  children,
  domain,
}: {
  children: ReactNode
  domain: DomainType
}) {
  const workspaceId = useWorkspaceId()

  const v = useDomainVerify()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Verify Domain
            <span className="text-sm text-primary"> {domain?.domain}</span>
          </SheetTitle>
          <SheetDescription>
            Add the DNS records below at your domain provider, then click Verify
            domain.
          </SheetDescription>
        </SheetHeader>
        <div className="custom-scroll flex flex-col gap-4 overflow-auto px-6">
          <span>DNS records</span>
          {domain?.dnsRecords?.map((dns) => (
            <ShowDnsRecord dns={dns} key={dns?.value} />
          ))}
        </div>
        <SheetFooter>
          <div className="flex w-full items-end justify-end gap-2">
            <SheetClose asChild>
              <Button variant="outline" size="lg">
                Close
              </Button>
            </SheetClose>
            <Button
              disabled={v.isPending}
              size="lg"
              onClick={() => {
                v.mutateAsync({
                  domainId: domain.id,
                  workspaceId,
                })
              }}
            >
              {v.isPending && <Spinner />} Veirfy
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ShowDnsRecord({ dns }: { dns: DnsRecord }) {
  const { copy: copyName, showCopiedSuccess: showNameCopiedSuccess } = useCopy({
    text: dns.name,
  })

  const { copy: copyValue, showCopiedSuccess: showValueCopiedSuccess } =
    useCopy({
      text: dns.value,
    })

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2">
      <span>{dns?.type}</span>
      <div className="p-2rounded-md flex flex-col rounded-md bg-muted p-2">
        <span>Name</span>
        <div className="flex items-start gap-2">
          <span className="break-all text-muted-foreground">{dns?.name}</span>
          <Button variant="outline" size="icon-xs" onClick={copyName}>
            {showNameCopiedSuccess ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
      </div>
      <div className="p-2rounded-md flex flex-col rounded-md bg-muted p-2">
        <span>Value</span>
        <div className="flex items-start gap-2">
          <span className="break-all text-muted-foreground"> {dns?.value}</span>
          <Button variant="outline" size="icon-xs" onClick={copyValue}>
            {showValueCopiedSuccess ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
      </div>
    </div>
  )
}
