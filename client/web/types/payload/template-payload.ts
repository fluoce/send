export type TemplateCreateType = {
  name: string
}

export type TemplateUpdateType = {
  name?: string
  status?: "PUBLISH" | "DRAFT"
  from?: string | null
  replyTo?: string
  subject?: string | null
}
