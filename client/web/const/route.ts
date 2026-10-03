const base = "/dashboard"
const templateEditBase = "/template-editor"

export const dashboardRoute = {
  base,
  createWorkspace: `${base}/create-workspace`,
  upgrade: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/upgrade`,
  workspace: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}`,
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
