"use client"

import { TemplateContentHtmlEditor } from "@/components/module/template/template-content-html-editor"
import { TemplateContentTextEditor } from "@/components/module/template/template-content-text-editor"
import { TemplateMetaEditor } from "@/components/module/template/template-meta-editor"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { useTemplateEditor } from "@/context/template-editor-context"

export default function TemplateEditPage() {
  const { refetchKey, editor } = useTemplateEditor()

  return (
    <PageWrapper key={refetchKey} className="gap-0">
      <TemplateMetaEditor />
      {editor == "text" ? (
        <TemplateContentTextEditor />
      ) : editor == "html" ? (
        <TemplateContentHtmlEditor />
      ) : null}
    </PageWrapper>
  )
}
