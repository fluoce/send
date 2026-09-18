export type WorkspaceStatusType = "ACTIVE" | "DEACTIVE"

export type WorkspaceType = {
  id: string
  userId: string
  name: string
  status: WorkspaceStatusType
  createdAt: string
  updatedAt: string
}

export type WorkspaceDataType = {
  workspace: WorkspaceType
}

export type WorkspacesDataType = {
  workspaces: WorkspaceType[]
}
