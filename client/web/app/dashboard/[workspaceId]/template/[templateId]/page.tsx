"use client"

import { useTemplateId } from "@/hooks/use-template-id"

export default function TemplateEditPage() {
  const templateId = useTemplateId()

  return <div>{templateId}</div>
}
