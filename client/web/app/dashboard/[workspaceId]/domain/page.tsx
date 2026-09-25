"use client"

import { DomainColumns } from "@/components/columns/domain-columns"
import { CreateUpdateDomain } from "@/components/form/create-update-domain"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Nodata } from "@/components/ui/no-data"
import { externalRoute } from "@/const/route"
import { useDomains } from "@/hooks/use-domain"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ArrowUpRight, Globe, Plus } from "lucide-react"
import Link from "next/link"

export default function DomainPage() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading } = useDomains({
    workspaceId,
  })

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="Domains"
          description="Manage your workspace's Domains."
        />
        <CreateUpdateDomain>
          <Button>
            <Plus /> Domain
          </Button>
        </CreateUpdateDomain>
      </div>
      {data?.data?.domains?.length ? (
        <DataTable
          columns={DomainColumns}
          data={(data?.data?.domains || []).map((domain) => ({
            ...domain,
            action: null,
          }))}
        />
      ) : (
        <Nodata
          icon={<Globe />}
          title="Add Domain"
          description="let's add your first Domain"
        >
          <Link href={externalRoute.sendDocs} tabIndex={-1}>
            <Button variant="secondary">
              <ArrowUpRight /> Documentation
            </Button>
          </Link>
          <CreateUpdateDomain>
            <Button>
              <Plus /> Add New
            </Button>
          </CreateUpdateDomain>
        </Nodata>
      )}
    </PageWrapper>
  )
}
