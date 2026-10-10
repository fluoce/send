import { ApiKeyStatusType } from "./api-key-data"
import { DomainStatusType } from "./domain-data"
import { MessageStatusType, MessageType } from "./message-data"
import { TemplateStatusType } from "./template-data"

export type StatusCountType<T extends string> = Record<T, number>

export type DashboardEntityCount<T extends string> = {
  title: string
  total: number
  statusCount: StatusCountType<T>
}

export type DashboardType = {
  count: {
    messageCount: DashboardEntityCount<MessageStatusType>
    apiKeyCount: DashboardEntityCount<ApiKeyStatusType>
    domainCount: DashboardEntityCount<DomainStatusType>
    templateCount: DashboardEntityCount<TemplateStatusType>
  }
  messages: MessageType[]
}

export type DashboardDataType = {
  dashboard: DashboardType
}
