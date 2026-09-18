"use client"

import { useFluoceAuth } from "@fluoce/auth-react"

export default function WorkspaceHomePage() {
  const { user } = useFluoceAuth()

  return (
    <div>
      <div>{user?.name}</div>
    </div>
  )
}
