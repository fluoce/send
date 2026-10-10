"use client"

import { MessageColumns } from "@/components/columns/message-colums"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { dashboardRoute } from "@/const/route"
import { useDashboard } from "@/hooks/use-dashboard"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {
  ChevronRight,
  LayoutDashboard,
  ListClock,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

export default function WorkspaceHomePage() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useDashboard({
      workspaceId,
    })

  if (isLoading) {
    return <PageSpinner />
  }

  return isError ? (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <div>Failed to load Dashboard. Please try again.</div>
      <span>{error ? error?.message : ""}</span>
      <Button onClick={() => refetch()}>
        <RotateCcw /> Retry
      </Button>
    </div>
  ) : (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          icon={<LayoutDashboard />}
          title="Dashboard"
          description="Overview of your Send workspace."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="opacity"
          >
            <RotateCcw className={isRefetching ? "animate-spin" : undefined} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {Object.values(data?.data?.dashboard?.count ?? {}).map((item) => (
          <div key={item?.title} className="flex flex-col gap-2 bg-muted p-2">
            <div className="flex flex-col border-b p-2">
              <span className="text-sm">{item?.title}</span>
              <span className="text-lg font-semibold text-muted-foreground">
                {item?.total}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 p-2">
              {Object.entries(item?.statusCount ?? {}).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex flex-1 flex-wrap justify-between gap-x-2 text-[11px] font-medium text-muted-foreground"
                  >
                    <span className="text-[10px]">{status}</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          icon={<ListClock />}
          title="Recent Messages"
          description="Latest messages from your Send workspace."
        />
        <div className="flex items-center gap-2">
          <Link href={dashboardRoute.message({ workspaceId })} tabIndex={-1}>
            <Button variant="outline" className="opacity px-2.5">
              View More <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
      <DataTable
        columns={MessageColumns}
        data={data?.data?.dashboard?.messages ?? []}
        emptyMessage="no messages to display !"
      />
    </PageWrapper>
  )
}
