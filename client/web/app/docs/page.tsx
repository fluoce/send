import { Button } from "@/components/ui/button"
import { BadgeInfo } from "lucide-react"

export default function DocsHome() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Button>
        <BadgeInfo /> Docs Soon
      </Button>
    </div>
  )
}
