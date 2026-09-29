"use client"

import { useTemplateEditor } from "@/context/template-editor-context"

export function TemplateContentEditor() {
  const { template } = useTemplateEditor()

  return <div>content</div>
}
