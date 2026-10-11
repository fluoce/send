export type MessageStatusType = "DELIVERED" | "FAILED" | "PENDING" | "SENT"

export type MessageTypeType = "EMAIL" | "SMS"

export type MessageType = {
  id: string
  workspaceId: string
  apiKeyId: string
  status: MessageStatusType
  type: MessageTypeType
  from: string
  to: string[]
  content: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type MessageDataType = {
  message: MessageType
}
export type MessagesDataType = {
  messages: MessageType
}
