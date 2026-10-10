"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { ReceiptText } from "lucide-react"
import { useParams } from "next/navigation"

export default function MessagePage() {
  const { messageId } = useParams<{ messageId: string }>()

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          icon={<ReceiptText />}
          title="Message Details"
          description="View the details for this message."
        />
      </div>
      {messageId}
    </PageWrapper>
  )
}
