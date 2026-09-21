"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/types/common/data-table-features"
import { ApiKeyStatus, ApiKeyType } from "@/types/data/api-key-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import {
  Ban,
  CheckCheck,
  ChevronDown,
  CircleCheck,
  Copy,
  Edit,
  EllipsisVertical,
  Plus,
  Trash2,
} from "lucide-react"
import { funcDate } from "@/func/func-date"
import { funcTrunc } from "@/func/func-trunc"
import { useCopy } from "@/hooks/use-copy"
import { CreateUpdateApiKey } from "../form/create-update-api-key"
import { useApiKeyUpdate } from "@/hooks/use-api-key"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Spinner } from "../ui/spinner"
import { DeleteApiKey } from "../form/delete-api-key"
import { AttachDomainWithApiKey } from "../form/attach-domain-with-api-key"

const columnHelper = createColumnHelper<
  DataTableFeatures,
  ApiKeyType & {
    action: any
  }
>()

export const ApiKeyColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => funcTrunc(info.getValue(), 16),
  }),
  columnHelper.accessor("key", {
    header: "Key",
    cell: (info) => {
      const { copy, showCopiedSuccess } = useCopy({
        text: info.getValue(),
      })

      return (
        <div className="flex items-center gap-1">
          {funcTrunc(info.getValue(), 8)}
          <Button
            onClick={() => copy()}
            variant="secondary"
            size="icon-sm"
            className="text-muted-foreground"
          >
            {showCopiedSuccess ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
      )
    },
  }),
  columnHelper.accessor("domain", {
    header: "Domain",
    cell: (info) => {
      const domain = info.row.original.domain
      return (
        <AttachDomainWithApiKey domain={domain!}>
          <Button variant="ghost">
            {domain ? (
              <span className="flex items-center gap-1">
                {funcTrunc(domain?.domain)} <ChevronDown />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-blue-500">
                <Plus /> Domain
              </span>
            )}
          </Button>
        </AttachDomainWithApiKey>
      )
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      let colorClass = ""
      if (status === "DEACTIVE") {
        colorClass = "text-yellow-500"
      } else if (status === "SUSPEND") {
        colorClass = "text-red-500"
      }
      return <span className={colorClass}>{status}</span>
    },
  }),
  columnHelper.accessor("expireAt", {
    header: "Expires At",
    cell: (info) => {
      const date = info.getValue()
      return date ? funcDate(date) : "~"
    },
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
      const workspaceId = useWorkspaceId()
      const { mutateAsync, isPending } = useApiKeyUpdate()
      const apiKey = info?.row?.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isPending} asChild>
            <Button variant="ghost" size="icon">
              {isPending ? <Spinner /> : <EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <CreateUpdateApiKey apiKey={apiKey}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit /> Edit
              </DropdownMenuItem>
            </CreateUpdateApiKey>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {apiKey?.status == "ACTIVE" ? <CircleCheck /> : <Ban />}
                {apiKey?.status}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ApiKeyStatus?.filter((s) => apiKey?.status !== s).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() =>
                      mutateAsync({
                        body: {
                          status: s,
                        },
                        apiKeyId: apiKey.id,
                        workspaceId,
                      })
                    }
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DeleteApiKey apiKey={apiKey}>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DeleteApiKey>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
