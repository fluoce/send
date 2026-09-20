export type DomainStatusType = "PENDING" | "VERIFIED" | "FAILED" | "DISABLED"

export type DomainType = {
  id: string
  workspaceId: string
  domain: string
  status: DomainStatusType
  region: string
  createdAt: string
  updatedAt: string
}

export type DomainDataType = {
  domain: DomainType
}

export type DomainsDataType = {
  domains: DomainType[]
}

export type DomainInternalStatusType = "DISABLED" | "ENABLED"

export const DomainStatus: DomainInternalStatusType[] = ["DISABLED", "ENABLED"]
