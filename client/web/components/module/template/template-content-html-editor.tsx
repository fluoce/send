"use client"

import { useOnCtrlS } from "@/hooks/use-on-ctrl-s"
import { useSaveTemplateHtml } from "@/hooks/use-save-template-html"
import { useTemplate } from "@/hooks/use-template"
import { useTemplateId } from "@/hooks/use-template-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { RefObject, useEffect, useRef, useState } from "react"

export function TemplateContentHtmlEditor() {
  const templateId = useTemplateId()

  const workspaceId = useWorkspaceId()

  const { data } = useTemplate({
    templateId,
    workspaceId,
  })

  const templateHtml = data?.data?.template?.html || ""

  const [html, setHtml] = useState(templateHtml)

  const editorContentRef = useRef<HTMLDivElement>(null)

  const { save, setInitialHtml, isSaving, saveNow } = useSaveTemplateHtml({
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

  useOnCtrlS({
    func: () => {
      saveNow(html)
    },
    ref: editorContentRef as RefObject<HTMLDivElement>,
  })

  return (
    <div ref={editorContentRef} className="flex items-center justify-center">
      HTML Editor.
    </div>
  )
}
