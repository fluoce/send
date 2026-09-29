"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { CheckCheck, Copy, Edit, EllipsisVertical, Trash2 } from "lucide-react"
import { funcTrunc } from "@/func/func-trunc"
import { DataTableFeatures } from "@/types/common/data-table-features"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { TemplateType } from "@/types/data/template-data"
import { useCopy } from "@/hooks/use-copy"
import { DeleteTemplate } from "../form/delete-template"
import Link from "next/link"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { dashboardRoute } from "@/const/route"
import { useRouter } from "next/navigation"

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
  columnHelper.accessor("form", {
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
        status === "PUBLISH" ? "text-blue-500" : "text-muted-foreground"
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
      const router = useRouter()
      const template = info?.row?.original
      const workspaceId = useWorkspaceId()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical />
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
              <Edit /> Edit
            </DropdownMenuItem>
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
