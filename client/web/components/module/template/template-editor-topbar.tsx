"use client"

import { Button } from "@/components/ui/button"
import { dashboardRoute } from "@/const/route"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { UpdateTemplateStatus } from "./update-template-status"
import { useTemplateEditor } from "@/context/template-editor-context"

export function TemplateEditorTopbar() {
  const { template, refetchTemplate, isRefetching } = useTemplateEditor()

  const workspaceId = useWorkspaceId()

  return (
    <nav className="flex items-center justify-between px-2 py-3">
      <Link
        href={dashboardRoute.template({
          workspaceId,
        })}
        tabIndex={-1}
      >
        <Button variant="outline">
          <ArrowLeft /> Back
        </Button>
      </Link>
      {template ? (
        <div className="flex items-center gap-2">
          <Button
            disabled={isRefetching}
            variant="outline"
            size="icon"
            onClick={() => refetchTemplate()}
            className="opacity"
          >
            <RotateCcw className={isRefetching ? "animate-spin" : undefined} />
          </Button>
          <UpdateTemplateStatus disabled={isRefetching} template={template} />
        </div>
      ) : null}
    </nav>
  )
}
