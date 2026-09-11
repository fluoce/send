export type WorkspaceCreateType = {
  name: string
}

export type WorkspaceUpdateType = {
  name: string
  status: "ACTIVE" | "DEACTIVE"
}
