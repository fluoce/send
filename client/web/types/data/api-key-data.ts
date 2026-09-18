export type ApiKeyType = {
  id: string
  workspaceId: string
  name: string
  key: string
  status: "ACTIVE" | "DEACTIVE" | "SUSPEND"
  expireAt: string
  createAt: string
  updatedAt: string
}

export type ApiKeyDataType = {
  apiKey: ApiKeyType
}

export type ApiKeysDataType = {
  apiKeys: ApiKeyType[]
}
