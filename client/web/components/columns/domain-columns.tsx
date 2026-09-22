"use client"

import { createColumnHelper } from "@tanstack/react-table"
import {
  DomainStatus,
  DomainStatusType,
  DomainType,
} from "@/types/data/domain-data"
import { Button } from "../ui/button"
import {
  Ban,
  CircleCheck,
  EllipsisVertical,
  Repeat2,
  Trash2,
} from "lucide-react"
import { funcTrunc } from "@/func/func-trunc"
import { DeleteDomain } from "../form/delete-domain"
import { DataTableFeatures } from "@/types/common/data-table-features"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useDomainUpdate } from "@/hooks/use-domain"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Spinner } from "../ui/spinner"
import { VerifyDomain } from "../form/verify-domain"

const columnHelper = createColumnHelper<
  DataTableFeatures,
  DomainType & {
    action?: any
  }
>()

export const DomainColumns = columnHelper.columns([
  columnHelper.accessor("domain", {
    header: "Domain",
    cell: (info) => funcTrunc(info.getValue(), 32),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as DomainStatusType
      let colorClass = ""
      if (status === "PENDING") {
        colorClass = "text-yellow-500"
      } else if (status === "FAILED" || status === "DISABLED") {
        colorClass = "text-red-500"
      } else if (status === "VERIFIED") {
        colorClass = "text-green-500"
      }
      return (
        <div className="flex items-center gap-2">
          <span className={colorClass}>{status}</span>
          {status !== "VERIFIED" && status !== "DISABLED" && (
            <VerifyDomain domain={info.row.original}>
              <Button variant="secondary" size="sm" className="text-blue-500">
                <Repeat2 /> verify
              </Button>
            </VerifyDomain>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
      const workspaceId = useWorkspaceId()
      const domain = info?.row?.original
      const u = useDomainUpdate()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={u.isPending}>
            <Button variant="ghost" size="icon">
              {u.isPending ? <Spinner /> : <EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(domain.status == "VERIFIED" || domain.status == "DISABLED") && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {domain?.status == "VERIFIED" ? <CircleCheck /> : <Ban />}
                  {domain?.status == "VERIFIED" ? "ENABLED" : domain.status}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {domain.status === "VERIFIED" && (
                    <DropdownMenuItem
                      onClick={() =>
                        u.mutateAsync({
                          body: {
                            status: "DISABLED",
                          },
                          workspaceId,
                          domainId: domain.id,
                        })
                      }
                      key="DISABLED"
                    >
                      DISABLED
                    </DropdownMenuItem>
                  )}
                  {domain.status === "DISABLED" && (
                    <DropdownMenuItem
                      onClick={() =>
                        u.mutateAsync({
                          body: {
                            status: "VERIFIED",
                          },
                          workspaceId,
                          domainId: domain.id,
                        })
                      }
                      key="ENABLED"
                    >
                      ENABLED
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DeleteDomain domainId={domain.id}>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DeleteDomain>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
