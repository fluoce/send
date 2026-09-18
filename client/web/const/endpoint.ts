const workspaceBase = "/workspace"

export const workspaceEndpoint = {
  get: ({ workspaceId }: { workspaceId: string }) =>
    `${workspaceBase}/${workspaceId}`,
  getAll: workspaceBase,
  getTrash: `${workspaceBase}/trash`,
  create: workspaceBase,
  delete: ({ workspaceId }: { workspaceId: string }) =>
    `${workspaceBase}/${workspaceId}`,
  update: ({ workspaceId }: { workspaceId: string }) =>
    `${workspaceBase}/${workspaceId}`,
}

const apiKeyBase = ({ workspaceId }: { workspaceId: string }) =>
  `/workspace/${workspaceId}/api-key`

export const apiKeyEndpoint = {
  get: ({ workspaceId, apiKeyId }: { workspaceId: string; apiKeyId: string }) =>
    `${apiKeyBase({ workspaceId })}/${apiKeyId}`,
  getAll: ({ workspaceId }: { workspaceId: string }) =>
    apiKeyBase({ workspaceId }),
  create: ({ workspaceId }: { workspaceId: string }) =>
    apiKeyBase({ workspaceId }),
  update: ({
    workspaceId,
    apiKeyId,
  }: {
    workspaceId: string
    apiKeyId: string
  }) => `${apiKeyBase({ workspaceId })}/${apiKeyId}`,
  delete: ({
    workspaceId,
    apiKeyId,
  }: {
    workspaceId: string
    apiKeyId: string
  }) => `${apiKeyBase({ workspaceId })}/${apiKeyId}`,
}
