"use client"

import { TemplateColumns } from "@/components/columns/template-columns"
import { CreateTemplate } from "@/components/form/create-template"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Nodata } from "@/components/ui/no-data"
import { externalRoute } from "@/const/route"
import { useTemplates } from "@/hooks/use-template"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ArrowUpRight, Form, Plus, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function TemplatePage() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading, refetch, isRefetching } = useTemplates({
    workspaceId,
  })

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="Templates"
          description="Manage your workspace's Templates."
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
          <CreateTemplate>
            <Button>
              <Plus /> Template
            </Button>
          </CreateTemplate>
        </div>
      </div>
      {data?.data?.templates?.length ? (
        <DataTable
          columns={TemplateColumns}
          data={(data?.data?.templates || []).map((template) => ({
            ...template,
            action: null,
          }))}
        />
      ) : (
        <Nodata
          icon={<Form />}
          title="Add Template"
          description="Let's add your first Template"
        >
          <Link href={externalRoute.sendDocs} tabIndex={-1}>
            <Button variant="secondary">
              <ArrowUpRight /> Documentation
            </Button>
          </Link>
          <CreateTemplate>
            <Button>
              <Plus /> Add New
            </Button>
          </CreateTemplate>
        </Nodata>
      )}
    </PageWrapper>
  )
}
