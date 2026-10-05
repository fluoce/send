"use client"

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useTemplateEditor } from "@/context/template-editor-context"

export function TemplateContentTextEditor() {
  const { template, save, saveNow } = useTemplateEditor()

  return (
    <div className="flex items-center justify-center">
      <SimpleEditor html={template?.html || ""} save={save} saveNow={saveNow} />
    </div>
  )
}
