export type ApiKeyCreateType = {
  name: string
  expireAt?: string
}

export type ApiKeyUpdateType = {
  name?: string
  expireAt?: string
  status?: "ACTIVE" | "DEACTIVE" | "SUSPEND"
}
