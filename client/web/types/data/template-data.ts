export type TemplateStatusType = "PUBLISH" | "DRAFT"

export type TemplateVariableType = {
  name: string
  required: boolean
  type: "string" | "number" | "boolean"
  defaultValue?: string | number | boolean
}

export type TemplateType = {
  id: string
  workspaceId: string
  name: string
  status: TemplateStatusType
  form: string | null
  replyTo?: string
  subject: string | null
  html: string | null
  text?: string
  variables: TemplateVariableType[] | null
  createdAt: string
  updatedAt: string
}

export type TemplateDataType = {
  template: TemplateType
}

export type TemplatesDataType = {
  templates: TemplateType[]
}

export const TemplateStatus: TemplateStatusType[] = ["PUBLISH", "DRAFT"]
