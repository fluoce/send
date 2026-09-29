const base = "/dashboard"

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
  }) => `${base}/${workspaceId}/template/${templateId}`,
}

export const externalRoute = {
  fluoce: "https://fluoce.com",
  sendDocs: "/docs",
}
