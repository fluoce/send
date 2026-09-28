export const workspaceQueryKey = {
  workspaces: ["workspaces"],
  workspace: ({ workspaceId }: { workspaceId: string }) => [
    "workspace",
    `${workspaceId}`,
  ],
  trashWorkspaces: ["workspaces", "trash"],
}

export const apiKeyQueryKey = {
  apiKeys: ({ workspaceId }: { workspaceId: string }) => [
    "apiKeys",
    `${workspaceId}`,
  ],
  apiKey: ({ apiKeyId }: { apiKeyId: string }) => ["apiKey", `${apiKeyId}`],
}

export const domainQueryKey = {
  domains: ({ workspaceId }: { workspaceId: string }) => [
    "domains",
    `${workspaceId}`,
  ],
  verifiedDomains: ({ workspaceId }: { workspaceId: string }) => [
    "domains",
    "verified",
    `${workspaceId}`,
  ],
  domain: ({ domainId }: { domainId: string }) => ["domain", `${domainId}`],
}

export const templateQueryKey = {
  templates: ({ workspaceId }: { workspaceId: string }) => [
    "templates",
    `${workspaceId}`,
  ],
  template: ({ templateId }: { templateId: string }) => [
    "template",
    `${templateId}`,
  ],
}
