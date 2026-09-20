export type ApiKeyStatusType = "ACTIVE" | "DEACTIVE" | "SUSPEND"

export type ApiKeyType = {
  id: string
  workspaceId: string
  name: string
  key: string
  status: ApiKeyStatusType
  expireAt: string
  createdAt: string
  updatedAt: string
}

export type ApiKeyDataType = {
  apiKey: ApiKeyType
}

export type ApiKeysDataType = {
  apiKeys: ApiKeyType[]
}

export const ApiKeyStatus: ApiKeyStatusType[] = ["ACTIVE", "DEACTIVE"]
