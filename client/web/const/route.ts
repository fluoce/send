const base = "/dashboard"

export const dashboardRoute = {
  base,
  createWorkspace: `${base}/create-workspace`,
  workspace: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}`,
  workspaceSetting: ({ worksapceId }: { worksapceId: string }) =>
    `${base}/${worksapceId}/setting`,
  apiKey: ({ workspaceId }: { workspaceId: string }) =>
    `${base}/${workspaceId}/api-key`,
}

export const externalRoute = {
  fluoce: "https://fluoce.com",
}
