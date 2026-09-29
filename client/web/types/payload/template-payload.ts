export type TemplateCreateType = {
  name: string
}

export type TemplateUpdateType = {
  name?: string
  status: "PUBLISH" | "DRAFT"
}
