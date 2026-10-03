"use client"

import { TemplateContentEditor } from "@/components/module/template/template-content-editor"
import { TemplateMetaEditor } from "@/components/module/template/template-meta-editor"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { useTemplateEditor } from "@/context/template-editor-context"

export default function TemplateEditPage() {
  const { refetchKey } = useTemplateEditor()

  return (
    <PageWrapper className="gap-0">
      <TemplateMetaEditor key={refetchKey} />
      <TemplateContentEditor />
    </PageWrapper>
  )
}
