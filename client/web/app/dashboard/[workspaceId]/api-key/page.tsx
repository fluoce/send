"use client"

import { ApiKeyColumns } from "@/components/columns/api-key-columns"
import { CreateUpdateApiKey } from "@/components/form/create-update-api-key"
import { PageSpinner } from "@/components/shared/loader"
import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Nodata } from "@/components/ui/no-data"
import { useApiKeys } from "@/hooks/use-api-key"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ArrowUpRight, Key, Plus } from "lucide-react"

export default function ApikeyPage() {
  const workspaceId = useWorkspaceId()

  const { data, isLoading } = useApiKeys({
    workspaceId,
  })

  console.log(data?.data.apiKeys)

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="API Keys"
          description="Manage your workspace API keys."
        />
        <CreateUpdateApiKey>
          <Button>
            <Plus /> API Key
          </Button>
        </CreateUpdateApiKey>
      </div>
      {data?.data?.apiKeys?.length ? (
        <DataTable
          columns={ApiKeyColumns}
          data={(data?.data?.apiKeys || []).map((apiKey) => ({
            ...apiKey,
            action: null,
          }))}
        />
      ) : (
        <Nodata
          icon={<Key />}
          title="Create API key"
          description="let's create your first api key"
        >
          <Button variant="secondary">
            <ArrowUpRight /> Documentation
          </Button>
          <CreateUpdateApiKey>
            <Button>
              <Plus /> Create New
            </Button>
          </CreateUpdateApiKey>
        </Nodata>
      )}
    </PageWrapper>
  )
}
