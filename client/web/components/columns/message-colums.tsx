"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { funcTrunc } from "@/func/func-trunc"
import { DataTableFeatures } from "@/types/common/data-table-features"
import { MessageStatusType, MessageType } from "@/types/data/message-data"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ChevronRight, EllipsisVertical, ReceiptText } from "lucide-react"
import { useRouter } from "next/navigation"
import { dashboardRoute } from "@/const/route"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

const columnHelper = createColumnHelper<
  DataTableFeatures,
  MessageType & {
    action?: any
  }
>()

export const MessageColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Id",
    cell: (info) => funcTrunc(info.getValue(), 32),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => funcTrunc(info.getValue(), 32),
  }),
  columnHelper.accessor("from", {
    header: "From",
    cell: (info) => funcTrunc(info.getValue(), 32),
  }),
  columnHelper.accessor("to", {
    header: "Recipients",
    cell: (info) => {
      const tos = info?.row?.original?.to
      if (!tos?.length) {
        return "~"
      }
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" title="All Recipients">
              {tos?.[0]} <ChevronRight />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="border-b">
              <SheetTitle>All Recipients</SheetTitle>
              <SheetDescription>
                Below is the complete list of recipients for this message.
              </SheetDescription>
            </SheetHeader>
            <div className="my-4 flex flex-col gap-2 overflow-auto px-4">
              {tos?.map((to, idx) => (
                <div
                  key={idx}
                  className="flex flex-1 items-center gap-2 p-2 text-sm"
                >
                  <span className="text-muted-foreground">{idx + 1} .</span>
                  <span className="line-clamp-2">{to}</span>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as MessageStatusType
      let colorClass = ""
      if (status === "PENDING") {
        colorClass = "text-yellow-500"
      } else if (status === "FAILED") {
        colorClass = "text-red-500"
      } else if (status === "DELIVERED") {
        colorClass = "text-green-500"
      } else if (status === "SENT") {
        colorClass = "text-blue-500"
      }
      return <span className={colorClass}>{status}</span>
    },
  }),

  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
      const router = useRouter()
      const message = info?.row?.original
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
                  dashboardRoute.messageDetails({
                    messageId: message?.id,
                    workspaceId,
                  })
                )
              }
            >
              <ReceiptText /> Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
