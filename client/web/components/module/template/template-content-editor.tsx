"use client"

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useSaveTemplate } from "@/hooks/use-save-template-html"
import { useTemplate } from "@/hooks/use-template"
import { useTemplateId } from "@/hooks/use-template-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useEffect, useState } from "react"

export function TemplateContentEditor() {
  const templateId = useTemplateId()
  const workspaceId = useWorkspaceId()

  const { data } = useTemplate({
    templateId,
    workspaceId,
  })

  const templateHtml = data?.data?.template?.html || ""
  const [html, setHtml] = useState(templateHtml)

  const { save, setInitialHtml, isSaving } = useSaveTemplate({
    templateId,
    workspaceId,
  })

  useEffect(() => {
    setHtml(templateHtml)
    setInitialHtml(templateHtml)
  }, [templateHtml, setInitialHtml])

  useEffect(() => {
    if (html === templateHtml) return
    save(html)
  }, [html])

  return (
    <div className="flex items-center justify-center">
      <SimpleEditor html={html} setHtml={setHtml} isSaving={isSaving} />
    </div>
  )
}
