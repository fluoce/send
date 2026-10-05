"use client"

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useTemplateEditor } from "@/context/template-editor-context"
import { useSaveTemplateHtml } from "@/hooks/use-save-template-html"
import { useTemplateId } from "@/hooks/use-template-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useEffect, useState } from "react"

export function TemplateContentTextEditor() {
  const templateId = useTemplateId()

  const workspaceId = useWorkspaceId()

  const { template } = useTemplateEditor()

  const templateHtml = template?.html || ""

  const [html, setHtml] = useState(templateHtml)

  const { save, setInitialHtml, saveNow } = useSaveTemplateHtml({
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
      <SimpleEditor html={html} setHtml={setHtml} saveNow={saveNow} />
    </div>
  )
}
