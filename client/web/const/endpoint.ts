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
  attechDomain: ({
    workspaceId,
    apiKeyId,
  }: {
    workspaceId: string
    apiKeyId: string
  }) => `${apiKeyBase({ workspaceId })}/${apiKeyId}/domain`,
  delete: ({
    workspaceId,
    apiKeyId,
  }: {
    workspaceId: string
    apiKeyId: string
  }) => `${apiKeyBase({ workspaceId })}/${apiKeyId}`,
}

const domainBase = ({ workspaceId }: { workspaceId: string }) =>
  `/workspace/${workspaceId}/domain`

export const domainEndpoint = {
  get: ({ workspaceId, domainId }: { workspaceId: string; domainId: string }) =>
    `${domainBase({ workspaceId })}/${domainId}`,
  getAll: ({ workspaceId }: { workspaceId: string }) =>
    domainBase({ workspaceId }),
  getVerified: ({ workspaceId }: { workspaceId: string }) =>
    `${domainBase({ workspaceId })}/verified`,
  create: ({ workspaceId }: { workspaceId: string }) =>
    domainBase({ workspaceId }),
  update: ({
    workspaceId,
    domainId,
  }: {
    workspaceId: string
    domainId: string
  }) => `${domainBase({ workspaceId })}/${domainId}`,
  delete: ({
    workspaceId,
    domainId,
  }: {
    workspaceId: string
    domainId: string
  }) => `${domainBase({ workspaceId })}/${domainId}`,
  verify: ({
    workspaceId,
    domainId,
  }: {
    workspaceId: string
    domainId: string
  }) => `${domainBase({ workspaceId })}/${domainId}/verify`,
}

const templateBase = ({ workspaceId }: { workspaceId: string }) =>
  `/workspace/${workspaceId}/template`

export const templateEndpoint = {
  get: ({
    workspaceId,
    templateId,
  }: {
    workspaceId: string
    templateId: string
  }) => `${templateBase({ workspaceId })}/${templateId}`,
  getAll: ({ workspaceId }: { workspaceId: string }) =>
    templateBase({ workspaceId }),
  create: ({ workspaceId }: { workspaceId: string }) =>
    templateBase({ workspaceId }),
  delete: ({
    workspaceId,
    templateId,
  }: {
    workspaceId: string
    templateId: string
  }) => `${templateBase({ workspaceId })}/${templateId}`,
}
