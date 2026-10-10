const base = "/dashboard"
const templateEditBase = "/template-editor"

export const dashboardRoute = {
  base,
  createWorkspace: `${base}/create-workspace`,
  upgrade: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/upgrade`,
  workspace: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}`,
  message: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/message`,
  messageDetails: ({
    workspaceId,
    messageId,
  }: {
    workspaceId: string
    messageId: string
  }) => `${base}/${workspaceId}/message/${messageId}`,
  workspaceSetting: ({ worksapceId }: { worksapceId: string }) =>
    `${base}/${worksapceId}/setting`,
  apiKey: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/api-key`,
  domain: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/domain`,
  template: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/template`,
  templateEdit: ({
    workspaceId,
    templateId,
  }: {
    workspaceId: string
    templateId: string
  }) => `${base}${templateEditBase}/${workspaceId}/${templateId}`,
}

export const externalRoute = {
  fluoce: "https://fluoce.com",
  sendDocs: "/docs",
}
