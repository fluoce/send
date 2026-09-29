"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "../ui/button"
import {
  CheckCheck,
  CircleCheck,
  Copy,
  Edit,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { funcTrunc } from "@/func/func-trunc"
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
import { TemplateStatus, TemplateType } from "@/types/data/template-data"
import { useCopy } from "@/hooks/use-copy"
import { DeleteTemplate } from "../form/delete-template"
import Link from "next/link"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { dashboardRoute } from "@/const/route"
import { useRouter } from "next/navigation"
import { useTemplateUpdateMeta } from "@/hooks/use-template"
import { Spinner } from "../ui/spinner"

const columnHelper = createColumnHelper<
  DataTableFeatures,
  TemplateType & {
    action?: any
  }
>()

export const TemplateColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Id",
    cell: (info) => {
      const { copy, showCopiedSuccess } = useCopy({
        text: info.getValue(),
      })
      return (
        <div className="flex items-center gap-1">
          <span>{funcTrunc(info.getValue())}</span>
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
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      const templateId = info?.row?.original?.id
      const workspaceId = useWorkspaceId()
      return (
        <Link
          href={dashboardRoute.templateEdit({
            templateId,
            workspaceId,
          })}
          className="text-blue-500 hover:underline"
        >
          {funcTrunc(info.getValue())}
        </Link>
      )
    },
  }),
  columnHelper.accessor("from", {
    header: "From",
    cell: (info) => {
      const value = info.getValue()
      return value ? funcTrunc(value) : "~"
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as "PUBLISH" | "DRAFT"
      const colorClass =
        status === "PUBLISH" ? "text-green-500" : "text-muted-foreground"
      return (
        <div className="flex items-center gap-2">
          <span className={colorClass}>{status}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
      const u = useTemplateUpdateMeta()
      const router = useRouter()
      const template = info?.row?.original
      const workspaceId = useWorkspaceId()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={u.isPending}>
            <Button variant="ghost" size="icon">
              {u.isPending ? <Spinner /> : <EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  dashboardRoute.templateEdit({
                    templateId: template.id,
                    workspaceId,
                  })
                )
              }
            >
              <Edit /> Edit Template
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {template?.status == "PUBLISH" ? (
                  <CircleCheck className="text-green-500" />
                ) : (
                  <Pencil />
                )}
                {template?.status}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {TemplateStatus.filter(
                  (status) => status !== template?.status
                ).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      u.mutate({
                        body: {
                          status,
                        },
                        workspaceId,
                        templateId: template.id,
                      })
                    }}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DeleteTemplate template={template}>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DeleteTemplate>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
