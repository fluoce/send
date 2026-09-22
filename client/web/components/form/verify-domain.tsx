"use client"

import { DomainType } from "@/types/data/domain-data"
import { ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { useDomainVerify } from "@/hooks/use-domain"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function VerifyDomain({
  children,
  domain,
}: {
  children: ReactNode
  domain: DomainType
}) {
  const workspaceId = useWorkspaceId()
  const { mutateAsync: verifyDomain, isPending } = useDomainVerify()

  const [copied, setCopied] = useState<string | null>(null)

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)

    setCopied(key)

    setTimeout(() => {
      setCopied(null)
    }, 1500)
  }

  const handleVerify = async () => {
    if (!workspaceId) return

    await verifyDomain({
      workspaceId,
      domainId: domain.id,
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Verify {domain.domain}</SheetTitle>

          <SheetDescription>
            Add the following DNS records to your domain provider. Once the
            records are added, click "Verify domain".
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Domain */}
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Domain</p>

            <p className="mt-1 font-medium">{domain.domain}</p>
          </div>

          {/* DNS Records */}
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">DNS records</h3>

              <p className="text-sm text-muted-foreground">
                Add these CNAME records to your DNS provider.
              </p>
            </div>

            <div className="space-y-3">
              {domain.dnsRecords.map((record, index) => {
                const nameKey = `name-${index}`
                const valueKey = `value-${index}`

                return (
                  <div
                    key={`${record.name}-${index}`}
                    className="space-y-4 rounded-lg border p-4"
                  >
                    {/* Type */}
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>

                      <p className="font-medium">{record.type}</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Name</p>

                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md bg-muted px-3 py-2 text-xs break-all">
                          {record.name}
                        </code>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyValue(record.name, nameKey)}
                        >
                          {copied === nameKey ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Value</p>

                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md bg-muted px-3 py-2 text-xs break-all">
                          {record.value}
                        </code>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyValue(record.value, valueKey)}
                        >
                          {copied === valueKey ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Help */}
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="font-medium">After adding the records</p>

            <p className="mt-1 text-muted-foreground">
              DNS changes can take some time to propagate. You can click verify
              again if the domain is not verified immediately.
            </p>
          </div>
        </div>

        <SheetFooter>
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify domain"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
