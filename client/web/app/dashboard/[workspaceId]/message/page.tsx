"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Send } from "lucide-react"

export default function MessagePage() {
  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          icon={<Send />}
          title="Messages"
          description="View your workspace's messages."
        />
      </div>
    </PageWrapper>
  )
}
