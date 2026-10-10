import { PageHeader } from "@/components/shared/page-header"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Sparkle } from "lucide-react"

export default function UpgradePage() {
  return (
    <PageWrapper>
      <PageHeader
        icon={<Sparkle className="text-primary" />}
        title="Upgrade"
        description="Upgrade your Send workspace to unlock more features."
      />
    </PageWrapper>
  )
}
