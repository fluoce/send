"use client"

import { useFluoceAuth } from "@fluoce/auth-react"

export default function DashboardHome() {
  const { user } = useFluoceAuth()

  return (
    <div>
      <div>{user?.name}</div>
    </div>
  )
}
